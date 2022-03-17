import React, { useState, useEffect } from 'react';
import { 
  Flex,
  Box,
  Spinner,
  Heading,
  Text
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';
import StockCard from '../../components/StockCard/StockCard';
import StockCardMini from '../../components/StockCardMini/StockCardMini';
import { useSession, getSession } from "next-auth/react";
import { connectToDatabase } from '../../lib/db';

const StyledDiv = styled.div`
  padding: 10px;
`;

/************************************************************************************* */

async function fetcher(url, ticker) {
  const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
          ticker: ticker,
      }),
      headers: {
          "Content-Type": "application/json",
      },
  });

  if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.status = res.status;
      error.info = await res.json();
      throw error;
  }
  return await res.json();
}

const initFetcher = (...args) => fetch(...args).then(res => res.json());

function Watchlist({ userWatchlist, initTickerData }){

  const { data: session } = useSession();

  const [mongoDBWatchlist, setMongoDBWatchlist] = useState(userWatchlist || []);
  const [tickerData, setTickerData] = useState(initTickerData || []);
  const [isLoading, setIsLoading] = useState(false);

  async function refetchTickerData() {
    setTickerData([]);
    let newTickerData = [];
    for (const symbol of mongoDBWatchlist) {
      const result = await Promise.all([
        fetcher('/api/profilefetcher', symbol),
        fetcher('/api/quotefetcher', symbol)
      ]);

      const [profile, quote] = result;

      newTickerData.push({profile, quote});
    }

    setTickerData(newTickerData);
  }

  async function clickHandler(ticker) {
    setIsLoading(true);
    setMongoDBWatchlist([]);
    const res = await fetch('/api/users/watchlistdelete', {
      method: 'PATCH',
      body: JSON.stringify({
        ticker: ticker
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const resBody = await res.json();
    setMongoDBWatchlist(resBody.value.watchlist);
    setIsLoading(false);
  }

  useEffect(() => {
    async function refetchWhenWatchlistChanges() {
      await refetchTickerData();
    }

    refetchWhenWatchlistChanges();
  }, [mongoDBWatchlist]);

  // console.log("Ticker Data", tickerData);

  //https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
  const highest = [...tickerData].sort((x,y) => (x.quote.dp < y.quote.dp) ? 1 : -1);
  const lowest = [...tickerData].sort((x,y) => (x.quote.dp > y.quote.dp) ? 1 : -1);
  const flat = [...tickerData].sort((x,y) => (Math.abs(x.quote.dp) > Math.abs(y.quote.dp)) ? 1 : -1);

  if (typeof window === 'undefined') return null;

  if (!session) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Box display="inline-block">
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bg={'red.500'}
            rounded={'50px'}
            w={'55px'}
            h={'55px'}
            textAlign="center">
            <CloseIcon boxSize={'20px'} color={'white'} />
          </Flex>
        </Box>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          You must be logged in to view the watchlist!
        </Heading>
        <Text color={'gray.500'}>
          Please sign in or sign up (and then sign in) with an account to access the watchlist page!
        </Text>
      </Box>
    )
  }

  // Loading
  if (isLoading) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Box>
    )
  }

  return(

    <div>
      <StyledDiv>
        <Heading>My Watchlist</Heading>
          <Flex wrap="wrap" justify="space-evenly" align="center">
            {tickerData.map((data, index) => 
              <StockCard key={index} profile={data.profile} quote={data.quote} clickHandler={clickHandler} />
            )}
          </Flex>
      </StyledDiv>
      <StyledDiv>
        <Heading>Watchlist Statistics</Heading>
          <StyledDiv>
            <Heading size="md" my="10px">Best Performers</Heading>
            {highest &&
            <Box>
              { highest.slice(0,3).map((data, index) => 
                <StockCardMini key={index} profile={data.profile} quote={data.quote} />
              )}
            </Box>
          }
          </StyledDiv>
        <StyledDiv>
          <Heading size="md" my="10px">Worst Performers</Heading>
          {lowest &&
          <Box>
            { lowest.slice(0,3).map((data, index) => 
              <StockCardMini key={index} profile={data.profile} quote={data.quote} />
            )}
          </Box>
        }
        </StyledDiv>
        <StyledDiv>
          <Heading size="md" my="10px">Trading Flat</Heading>
          {flat &&
          <Box>
            { flat.slice(0,3).map((data, index) =>   
              <StockCardMini key={index} profile={data.profile} quote={data.quote} />
            )}
          </Box>
        }
        </StyledDiv>
      </StyledDiv>
    </div>
  )

}

export async function getServerSideProps(context) {

  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        session: session,
        userWatchlist: [],
        initTickerData: []
      }
    }
  }

  const client = await connectToDatabase();
  const db = client.db();
  const options = {
      projection: { _id: 0, watchlist: 1 }
  };

  const userWatchlist = await db.collection('watchlists').findOne({ email: session.user.email }, options);

  // If watchlist doesn't exist for user then create one for user
  if (!userWatchlist) {
    const result = await db.collection('watchlists').insertOne({
      email: session.user.email,
      watchlist: []
    });

    client.close();
    return {
      props: {
        session: session,
        userWatchlist: [],
        initTickerData: []
      }
    }
  }

  //Ticker data is the array that needs to be populated with api response data (populated below in the forEach)
  async function fetchAllTickerData() {
    let tickerData = [];

    for (const symbol of userWatchlist.watchlist) {
      const result = await Promise.all([
        initFetcher(
          `${process.env.FINNHUB_API_BASE_URL}/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY_2}`
        ),
        initFetcher(
          `${process.env.FINNHUB_API_BASE_URL}/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY_2}`
        )
      ]);
      
      const [profile, quote] = result;
      tickerData.push({profile, quote});
    }
    return tickerData;
  }
  
  const initTickerData = await fetchAllTickerData();

  console.log("Server ticker data", initTickerData);

  client.close();
  return {
    props: {
      session: session,
      userWatchlist: userWatchlist.watchlist,
      initTickerData: JSON.parse(JSON.stringify(initTickerData))
    }
  }
}

export default Watchlist;
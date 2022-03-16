import React, { useState, useEffect } from 'react';
import { 
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Button,
  HStack,
  Center,
  Spinner,
  Heading,
  Text
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';
import useStockProfile from '../../hooks/useStockProfile';
import { FaSearch } from 'react-icons/fa';
import NextLink from 'next/link';
import useStockQuote from '../../hooks/useStockQuote';
import { useSession, getSession } from "next-auth/react";
import useSWR from 'swr';
import { connectToDatabase } from '../../lib/db';

/*
REFACTOR TO USE SERVERSIDE RENDERING, FETCH TICKERS FROM DB AND THEN FETCH FROM API FOR EACH TICKER IN DB AND THEN SERVE ALL AT
ONCE TO COMPONENT THRU PROPS, THEN HAVE FUNCTIONS TO REMOVE TICKERS AND THUS MODIFY DB AND LOCAL COPY OF TICKER INFO FOR CALCULATIONS
*/

//Have favorites list, containing individual cards of each favorited stock data
//Individual list entry will contain Name, Ticker, Current Price, Up or Down colored arrow, indicating higher or lower than opening price
//Also have "-" button, which will remove the entry from the stored list, and therefore will remove it from being rendered.

//Then have second larger container, which contains four "performers" lists. Best, worst, flat, highest volume.
//Contain individual entry cards again. 
    //For all, have name, ticker, current price.
    //For best, worst, flat, have same up or down arrow, but display percent increase or decrease from opening price.
    //Specifically for highest volume, still show arrow, but instead of showing percent number, show volume number.

    
//For database, just need list of {ticker}. Can use ticker to grab all other information.


const WatchlistDiv = styled.div`
  padding: 10px;
`;

const StatsDiv = styled.div`
  padding: 10px;
`;

const StatListDiv = styled.div`
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

      console.log("== REFETCH Promise all result", result);
      const [profile, quote] = result;

      newTickerData.push({profile, quote});
    }

    setTickerData(newTickerData);
  }

  async function clickHandler(ticker) {
    setIsLoading(true);
    setMongoDBWatchlist([]);
    const res = await fetch('/api/watchlistdelete', {
      method: 'PATCH',
      body: JSON.stringify({
        ticker: ticker
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const resBody = await res.json();
    console.log("resBody", resBody.value.watchlist);
    setMongoDBWatchlist(resBody.value.watchlist);
    await refetchTickerData();
    setIsLoading(false);
  }


  const loading = (data) => ((data.profile !== undefined)&&(data.quote !== undefined));

  const isPopulated = tickerData.every(loading);

  console.log("Ticker Data", tickerData);

  let highest = [];
  let lowest = [];
  let flat = [];

  if(isPopulated){
    let sortWith = [...tickerData];

    //https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    sortWith.sort((x,y) => (x.quote.dp < y.quote.dp) ? 1 : -1)
    highest = [...sortWith];

    sortWith.sort((x,y) => (x.quote.dp > y.quote.dp) ? 1 : -1)
    lowest = [...sortWith];

    sortWith.forEach(member => {
      member.quote.dp = Math.abs(member.quote.dp)
    })
    sortWith.sort((x,y) => (x.quote.dp > y.quote.dp) ? 1 : -1)
    flat = [...sortWith];

  }

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
      <WatchlistDiv>
        <h1>My Watchlist</h1>

          <Box>
            {tickerData.map((data, index) => 
                
              <div key={index}>
                <p>{data.profile.ticker}</p>
                <p>{data.profile.name}</p>
                <p>{data.quote.c}</p>
                <Stat>
                  <StatHelpText>
                      <HStack height='50px'>
                          <div>
                              <StatArrow type={data.quote.d > 0 ? 'increase' : 'decrease'} />
                              ${data.quote.d}
                          </div>
                          <div>
                            {data.quote.dp}%
                          </div>
                      </HStack>
                  </StatHelpText>
                </Stat>
                <Button onClick={_ => clickHandler(data.profile.ticker)}>x</Button>
              </div>
            )}
          </Box>
      </WatchlistDiv>

      <StatsDiv>
        <h1>Watchlist Statistics</h1>

        <StatListDiv>
          <h1>Best Performers</h1>

          {isPopulated &&
          <Box>
            { highest.slice(0,3).map(data => 
              
              <div key={data.profile.ticker}>
                <p>{data.profile.ticker}</p>
                <p>{data.profile.name}</p>
                <p>{data.quote.c}</p>


                <Stat>
                  <StatHelpText>
                      <HStack height='50px'>
                          <div>
                              <StatArrow type={data.quote.d > 0 ? 'increase' : 'decrease'} />
                              ${data.quote.d}
                          </div>

                      </HStack>
                  </StatHelpText>
                </Stat>
              </div>
            )}
          </Box>
        }
        </StatListDiv>






        <StatListDiv>
          <h1>Worst Performers</h1>

          {isPopulated &&
          <Box>
            { lowest.slice(0,3).map(data => 
                
              <div key={data.profile.ticker}>
                <p>{data.profile.ticker}</p>
                <p>{data.profile.name}</p>
                <p>{data.quote.c}</p>


                <Stat>
                  <StatHelpText>
                      <HStack height='50px'>
                          <div>
                              <StatArrow type={data.quote.d > 0 ? 'increase' : 'decrease'} />
                              ${data.quote.d}
                          </div>

                      </HStack>
                  </StatHelpText>
                </Stat>
              </div>
            )}
          </Box>
        }
        </StatListDiv>






        <StatListDiv>
          <h1>Trading Flat</h1>

          {isPopulated &&
          <Box>
            { flat.slice(0,3).map(data => 
                
              <div key={data.profile.ticker}>
                <p>{data.profile.ticker}</p>
                <p>{data.profile.name}</p>
                <p>{data.quote.c}</p>


                <Stat>
                  <StatHelpText>
                      <HStack height='50px'>
                          <div>
                              <StatArrow type={data.quote.d > 0 ? 'increase' : 'decrease'} />
                              ${data.quote.d}
                          </div>

                      </HStack>
                  </StatHelpText>
                </Stat>
              </div>
            )}
          </Box>
        }


        </StatListDiv>

      </StatsDiv>

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

      console.log("Promise all result", result);
      const [profile, quote] = result;

      tickerData.push({profile, quote});
    }

    console.log("In async");
    return tickerData;
  }
  
  const initTickerData = await fetchAllTickerData();

  console.log("Server ticker data", initTickerData);

  client.close();
  return {
    props: {
      session: session,
      userWatchlist: userWatchlist.watchlist,
      initTickerData: initTickerData
    }
  }
}

export default Watchlist;
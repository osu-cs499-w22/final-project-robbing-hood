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

import { parse, format } from 'date-fns';
//Have favorites list, containing individual cards of each favorited stock data
//Individual list entry will contain Name, Ticker, Current Price, Up or Down colored arrow, indicating higher or lower than opening price
//Also have "-" button, which will remove the entry from the stored list, and therefore will remove it from being rendered.

//Then have second larger container, which contains four "performers" lists. Best, worst, flat, highest volume.
//Contain individual entry cards again. 
    //For all, have name, ticker, current price.
    //For best, worst, flat, have same up or down arrow, but display percent increase or decrease from opening price.
    //Specifically for highest volume, still show arrow, but instead of showing percent number, show volume number.

    
//For database, just need list of {ticker}. Can use ticker to grab all other information.


/***************************************************************************** */
//Fake static database. "user1" is the user. Contains watchlist and portfolio entries.
//For this watchlist file, only need the watchlist entry
const stake1 = {
  ticker: "GME",
  quantity: 17
}
const stake2 = {
  ticker: "NVDA",
  quantity: 4
}
const stake3 = {
  ticker: "AAPL",
  quantity: 6
}

const user1 = {
  watchlist: ["GME","AAPL","NVDA","TSLA","MSFT","PFE","AMD","PLTR","SOFI"],

  portfolio: [stake1,stake2,stake3]
}


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
  return await res.json();;
}


function Watchlist({ userWatchlist }){

  const { data: session } = useSession();

  const { data, error } = useSWR('/api/watchlistfetcher', { refreshInterval: 60000 });
  console.log(data);
  const [mongoDBWatchlist, setMongoDBWatchlist] = useState(userWatchlist || []);
  console.log(mongoDBWatchlist);

  async function clickHandler(ticker) {
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
    console.log("resBody", resBody);
    setMongoDBWatchlist(resBody.watchlist);
  }


  //
  // Below, "user1.watchlist" is being used as the hypothetical array of tickers "watchlist" being fetched from the db
  // Instead, make db fetch call here, and populate below array with array fetched from db

  //  <<<<< Now, wherever in the code "user1.watchlist" is used, replace with "mongoDBWatchlist" >>>>>>> (Lmao, only happens on line 96, that's all, just replace that)

  console.log(mongoDBWatchlist);
  //Ticker data is the array that needs to be populated with api response data (populated below in the forEach)
  let tickerData = [];

  // Don't use hooks in loops!!!!!!!! Rule of hooks bro
  mongoDBWatchlist.forEach(async symbol => {

    // Profile

    const profile = await fetcher('/api/profilefetcher', symbol);

    const quote = await fetcher('/api/quotefetcher', symbol);


    tickerData.push({profile,quote})

  });


  const loading = (data) => ((data.profile !== undefined)&&(data.quote !== undefined));

  const isPopulated = tickerData.every(loading);

  console.log(tickerData)

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

    /////

  //Below on line 179 inside tickerData.map, there's the button with "-"
  //For this one, needs an onClick function that performs an removal on the "watchlist" array for that specific ticker string
  //Just do "remove (data.profile.ticker)", that's all that needs to be added.

  //Also, a similar thing needs to be added to the results section in search.js. Just a button, but instead do insert (profile.ticker) for user

  //////
  //////

  return(

    <div>

    
      <WatchlistDiv>
        <h1>My Watchlist</h1>

        {isPopulated &&
          <Box>
            { tickerData.map(data => 
                
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
                          <div>
                            {data.quote.dp}%
                          </div>
                      </HStack>
                  </StatHelpText>
                </Stat>



                <Button onClick={_ => clickHandler(data.profile.ticker)}>-</Button>
              </div>
            )}
          </Box>
        }


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

  const client = await connectToDatabase();
  const db = client.db();
  const options = {
      projection: { _id: 0, watchlist: 1 }
  };

  if (!session) {
    return {
      props: {
        session: session,
        userWatchlist: []
      }
    }
  }

  const userWatchlist = await db.collection('watchlists').findOne({ email: session.user.email }, options);

  return {
    props: {
      session: session,
      userWatchlist: JSON.parse(JSON.stringify(userWatchlist.watchlist))
    }
  }
}

export default Watchlist;














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
  Spinner
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import useStockProfile from '../hooks/useStockProfile';
import { FaSearch } from 'react-icons/fa';
import NextLink from 'next/link';
import useStockQuote from '../hooks/useStockQuote';

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



function Watchlist(){


  let tickerData = [];

  user1.watchlist.forEach(symbol => {
    console.log("yes")
    const {profile} = useStockProfile(symbol);
    const { quote } = useStockQuote(symbol);

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



                <button>-</button>
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

export default Watchlist;














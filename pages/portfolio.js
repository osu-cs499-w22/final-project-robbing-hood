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

//Have similar overall list container as in watchlist, but titled "your positions"
//Inside, have individual stock entry containers.
    //For a container, have name, ticker, current share price.
    //In smaller text, have total market value, share quantity.
    //Also have "-" button for each entry. Upon clicking will open text entry. put in how many shares to remove, click confirm
    //In similar manner have "+" button for each, which opens almost identical text entry asking to put in how many shares to add, click confirm.

//In separate container for second half of page, have performance of portfolio.
//List current overall value, list value at market open with up or down green/red comparison arrow. (Overall percent/value up or down)


//So for user database, will just need a list of {ticker, quantity} (like key value)


/***************************************************************************** */
//Fake static database. "user1" is the user. Contains watchlist and portfolio entries.
//For this portfolio file, need the portfolio array.

const stake1 = {
  ticker: "GME",
  quantity: 17
}
const stake2 = {
  ticker: "NVDA",
  quantity: 4
}
const stake3 = {
  ticker: "TSLA",
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




function Portfolio(){

  //
  // Below, "user1.watchlist" is being used as the hypothetical array of tickers "watchlist" being fetched from the db
  // Instead, make db fetch call here, and populate below array with array fetched from db
  let mongoDBPortfolio = [];  //First initialize as empty array

  //mongoDBWatchlist = ...    <<<DB fetch>>>

  //  <<<<< Now, wherever in the code "user1.watchlist" is used, replace with "mongoDBWatchlist" >>>>>>> (Lmao, only happens on line 96, that's all, just replace that)


  //Ticker data is the array that needs to be populated with api response data (populated below in the forEach)
  let tickerData = [];

  user1.portfolio.forEach(entry => {
    console.log("yes")
    const {profile} = useStockProfile(entry.ticker);
    const { quote } = useStockQuote(entry.ticker);
    const amount = entry.quantity;

    tickerData.push({profile,quote,amount})

  });


  const loading = (data) => ((data.profile !== undefined)&&(data.quote !== undefined));

  const isPopulated = tickerData.every(loading);

  console.log(tickerData)


  //Now populated, so calculate all the performance data to render below
  let totalOpenVal = 0;
  let currentVal = 0;
  let changeNum = 0;
  let changePercent = 0;

  if(isPopulated){
    tickerData.forEach(entry => {
      totalOpenVal = totalOpenVal + ((entry.quote.o) * entry.amount);
      currentVal = currentVal + ((entry.quote.c) * entry.amount);

    });
    changeNum = currentVal - totalOpenVal;
    changePercent = changeNum / currentVal;

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



                <p>Quantity: {data.amount}</p>
              </div>
            )}
          </Box>
        }


      </WatchlistDiv>


      <StatsDiv>
        <p>Performance:</p>
        <p>Total Value at Market Open: ${totalOpenVal}</p>
        <p>Total Current Value: ${currentVal}</p>
        <p>Change Since Market Open: ${changeNum} ({changePercent}%)</p>
        
      </StatsDiv>
  

        <div>
          <p>Here would be the form entry div box. With ticker and quantity text entry forms. Then add or remove button that does db change onClick</p>
        </div>



    </div>
  )

}

export default Portfolio;









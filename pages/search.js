import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    HStack,
    Button,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Spacer,
    StatGroup,
    Heading,
    List,
    ListItem,
    ListIcon,
    Link,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Divider,
    Container 
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import useStockProfile from '../hooks/useStockProfile';
import useStockPeers from '../hooks/useStockPeers';
import { FaSearch, FaPlus } from 'react-icons/fa';
import NextLink from 'next/link';
import useStockQuote from '../hooks/useStockQuote';
import useStockRecommendations from '../hooks/useStockRecommendations';
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { connectToDatabase } from '../lib/db';

import { parse, format } from 'date-fns';

const SearchDiv = styled.div`
    padding: 10px;
`;

function Search({ userWatchlist }) {

    const { data: session } = useSession();

    // https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render
    const router = useRouter();
    const query = router.query.q;
    const [ inputQuery, setInputQuery ] = useState(query || "");
    const [ addedStocks, setAddedStocks ] = useState(userWatchlist || []);

    const { profile } = useStockProfile(query);
    const { peers } = useStockPeers(query);
    const { quote } = useStockQuote(query);
    const { recommendations } = useStockRecommendations(query);

    const handleClick = async (ticker) => {
        setAddedStocks([]);
        const res = await fetch('/api/watchlistinsert', {
            method: 'POST',
            body: JSON.stringify({
                ticker: ticker
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resBody = await res.json();
        console.log(resBody.value.watchlist);
        setAddedStocks(resBody.value.watchlist);
    }

    return (
        <Box p={15}
        >
            <form onSubmit={e => {
                e.preventDefault();
                router.push(`${router.pathname}?q=${inputQuery}`);
            }}>
                <FormControl>
                    <FormLabel htmlFor='search'>Stock Ticker/Symbol Search</FormLabel>
                    <HStack>
                        <Input
                            id='search'
                            placeholder='Enter ticker (ex. AAPL)'
                            value={inputQuery}
                            onChange={e => setInputQuery(e.target.value)}
                        />
                        <Button type="submit" colorScheme="blue">Search</Button>
                    </HStack>
                    <FormHelperText>Ticker symbols or stock symbols are arrangements of symbols or characters representing specific assets or securities listed on a stock exchange or traded publicly (Ex. Apple = AAPL).</FormHelperText>
                </FormControl>
            </form>
            {profile && quote &&
            <Box 
            mt={6} 
            mb={6} 
            boxShadow={'base'}
            rounded={'md'}
            pl={10}
            pt={1}
            pb={5}
            >
                <Heading mt={4}>
                    {profile.ticker} 
                    <Box display={'inline-block'} color={quote.d > 0? 'green.400' : 'red.400'}>
                        <Stat display={'inline-block'}><StatArrow type={quote.d > 0 ? 'increase' : 'decrease'} /></Stat>
                        ({quote.dp}%)
                    </Box>
                    
                </Heading>
                <Heading size="md">{profile.name}</Heading>
                <Text>Exchange: {profile.exchange}</Text>
                <Text>Currency: {profile.currency}</Text>
                <Text>Industry: {profile.finnhubIndustry}</Text>
                <Text>IPO: {profile.ipo}</Text>
                {session &&
                <Button
                disabled={addedStocks.includes(query) ? true : false}
                mt={4}
                p={5}
                color={'white'}
                backgroundColor={'blue.400'}
                _hover={{ backgroundColor: 'blue.600' }}
                onClick={_ => handleClick(query)}
                >
                Add to Watchlist <Spacer pl={2}/><FaPlus/>
                </Button>
                }
            </Box>
            }
            {quote && 
            <Box
            mt={6} 
            mb={6} 
            boxShadow={'base'}
            rounded={'md'}
            pl={10}
            pt={3}
            pb={2.5}>
            <StatGroup
                textAlign={'center'}
            >
                <Stat>
                    <StatLabel>Current Price</StatLabel>
                    <StatNumber>${quote.c}
                        <Box display={'inline-block'} fontSize={15} color={quote.d > 0? 'green.400' : 'red.400'}>
                            <StatArrow type={quote.d > 0 ? 'increase' : 'decrease'} />
                            (${quote.d})
                        </Box>
                    </StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>High Price of the Day</StatLabel>
                    <StatNumber>${quote.h}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Low Price of the Day</StatLabel>
                    <StatNumber>${quote.l}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Open Price of the Day</StatLabel>
                    <StatNumber>${quote.o}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Previous Close Price</StatLabel>
                    <StatNumber>${quote.pc}</StatNumber>
                </Stat>
            </StatGroup>
            </Box>
            }
            {recommendations &&
            <Box
            mt={6} 
            mb={6} 
            boxShadow={'base'}
            rounded={'md'}
            pl={10}
            pt={3}
            pb={1}>
                <Table>
                    <TableCaption>Analyst recommendation trends for the previous {recommendations.length} months (# of analysts per category)</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Month</Th>
                            <Th isNumeric>Buy</Th>
                            <Th isNumeric>Hold</Th>
                            <Th isNumeric>Sell</Th>
                            <Th isNumeric>Strong Buy</Th>
                            <Th isNumeric>Strong Sell</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {recommendations.map((rec, index) => {
                            const date = parse(rec.period, "yyyy-MM-dd", new Date());
                            const finalDate = format(date, "MMMM yyyy");

                            return (
                                <Tr key={index}>
                                    <Td>{finalDate}</Td>
                                    <Td isNumeric>{rec.buy}</Td>
                                    <Td isNumeric>{rec.hold}</Td>
                                    <Td isNumeric>{rec.sell}</Td>
                                    <Td isNumeric>{rec.strongBuy}</Td>
                                    <Td isNumeric>{rec.strongSell}</Td>
                                </Tr>
                            )})
                        }
                    </Tbody>
                </Table>
            </Box>
            }
            {peers &&
            <>
                <Divider my={8}/>
                <Text fontSize={25}
                    borderTop = {1}
                    mb={6} 
                    pl={10}
                    pb={1}>
                    Related stocks:
                </Text>
                <List  
                    mb={6} 
                    pl={10}
                    pb={1}>
                    {peers.map((peer, index) => (
                        <ListItem key={index}>
                            <ListIcon as={FaSearch} />
                            <NextLink href={`/search?q=${peer}`} passHref>
                                <Link>{peer}</Link>
                            </NextLink>
                        </ListItem>
                    ))}
                </List>
            </>
            }
        </Box>
    )
}

export async function getServerSideProps(context) {

    const session = await getSession(context);

    const client = await connectToDatabase();
    const db = client.db();
    const options = {
        projection: { _id: 0, watchlist: 1 },
    };

    if (!session) {
        return {
            props: {
                session: session,
                userWatchlist: [],
            },
        };
    }

    const userWatchlist = await db
        .collection("watchlists")
        .findOne({ email: session.user.email }, options);

    return {
        props: {
            session: session,
            userWatchlist: JSON.parse(JSON.stringify(userWatchlist.watchlist)),
        },
    };
}

export default Search;
import React from 'react';
import {
    Flex,
    Box,
    Image,
    useColorModeValue,
    Icon,
    Tooltip,
    Button,
    Text,
    Stat,
    StatLabel,
    StatArrow,
    StatHelpText,
    HStack
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';

function StockCardMini({ profile, quote }) {
    return (
        <Box
            bg={useColorModeValue("white", "gray.800")}
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="md"
            position="relative"
        >
            <Box p="6">
                <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="2xl"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        {profile.ticker}
                    </Box>  
                </Flex>
                <Text>{profile.name}</Text>
                <Flex justifyContent="space-between" alignContent="center">
                    <Stat>
                        <StatHelpText>
                            <HStack height='50px'>
                                <div>
                                    <StatArrow type={quote.d > 0 ? 'increase' : 'decrease'} />
                                    ${quote.d.toFixed(2)}
                                </div>
                                <div>
                                    <StatArrow type={quote.dp > 0 ? 'increase' : 'decrease'} />
                                    {quote.dp}%
                                </div>
                            </HStack>
                        </StatHelpText>
                    </Stat>
                    <Box
                        fontSize="2xl"
                        color={useColorModeValue("gray.800", "white")}
                    >
                    <Box as="span" color={"gray.600"} fontSize="lg">
                        $
                    </Box>
                        {quote.c.toFixed(2)}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}

export default StockCardMini;
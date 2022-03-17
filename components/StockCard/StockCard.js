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

function StockCard({ profile, quote, clickHandler }) {
    return (
        <Box
            bg={useColorModeValue("white", "gray.800")}
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative"
        >

            <Image
                boxSize="sm"
                objectFit='contain'
                src={profile.logo}
                alt={`Picture of ${profile.ticker}`}
                roundedTop="lg"
            />

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
                    <Tooltip
                    label="Remove from watchlist"
                    bg="white"
                    placement={"top"}
                    color={"gray.800"}
                    fontSize={"1.2em"}
                    >
                    <Button display={"flex"} onClick={_ => clickHandler(profile.ticker)}>
                        <Icon as={FaTimes} h={7} w={7} alignSelf={"center"} />
                    </Button>
                    </Tooltip>
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

export default StockCard;
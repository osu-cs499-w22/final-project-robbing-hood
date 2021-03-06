import Image from 'next/image';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
  Flex,
} from '@chakra-ui/react';

export default function NewsPost({ category, datetime, headline, image, related, source, summary, url }) {

    const postDate = new Date(datetime * 1000).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric"});

    return (
        
        <Center py={6}>
            <LinkBox>
                <LinkOverlay href={url} isExternal>
                    <Box
                        maxW={'445px'}
                        w={'445px'}
                        h={'600px'}
                        bg={useColorModeValue('white', 'gray.900')}
                        boxShadow={'2xl'}
                        rounded={'md'}
                        p={6}
                        overflow={'hidden'}>
                        <Box
                        h={'220px'}
                        w={'full'}
                        bg={'gray.100'}
                        mt={-2}
                        mb={6}
                        pos={'relative'}>
                        <Image
                            src={
                                `/api/imagefetcher?url=${encodeURIComponent(image)}`
                            }
                            layout={'fill'}
                        />
                        </Box>
                        <Stack>
                        <Text
                            color={'green.500'}
                            textTransform={'uppercase'}
                            fontWeight={800}
                            fontSize={'sm'}
                            letterSpacing={1.1}>
                            {category}
                        </Text>
                        <Heading
                            color={useColorModeValue('gray.700', 'white')}
                            fontSize={'2xl'}
                            fontFamily={'body'}>
                            {headline}
                        </Heading>
                        <Text color={'gray.500'}>
                            {summary}
                        </Text>
                        </Stack>
                        <Flex mt={6} direction={'row'} spacing={4} align={'center'} justify='space-around'>
                            <Text color={'gray.500'}>Related: {related ? related : "None"}</Text>
                            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                                <Text fontWeight={600}>{source}</Text>
                                <Text color={'gray.500'}>{postDate}</Text>
                            </Stack>
                        </Flex>
                    </Box>
                </LinkOverlay>
            </LinkBox>
        </Center>
    );
}

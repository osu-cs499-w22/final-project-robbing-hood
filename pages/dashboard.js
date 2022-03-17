import React from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Text,
    Button, 
    Spacer,
    Heading
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { FaArrowRight } from 'react-icons/fa';

const FormatPhoto = styled.img`
    width: 100%;
    height: 800px;
    object-fit: cover;`;

export default function Dashboard() {
    const router = useRouter();

    const handleClick = (e) => {
        e.preventDefault()
        router.push("/users/signup")
    }
  return (
    <Box>
        <FormatPhoto src="https://www.finance-monthly.com/Finance-Monthly/wp-content/uploads/2021/08/Synthetic-Stcoks-The-Real-Day-Or-Just-A-Fad.jpg" alt='stock1'/>
        <Box color={'#fff'} position={'absolute'} top={'25%'} left={'50%'} transform={'translate(-50%,-50%)'}>
            <Text fontSize={40} fontWeight={'bold'}>Trade the modern way.<br/> Learn. Trade. Profit.</Text>
            <Text fontSize={15} pt={2}>Join Robbing Hood today and learn how to trade financial assets</Text>
            <Button
                mt={4}
                p={5}
                backgroundColor={'teal.400'}
                _hover={{ backgroundColor: 'teal.600' }}
                onClick={handleClick}
              >
                Join Today <Spacer pl={2}/><FaArrowRight/>
              </Button>
        </Box>
    </Box>
  );
}

import React from "react";
import styled from "@emotion/styled";
import Link from 'next/link';
import { Heading, Box, Text, Divider, Spacer} from "@chakra-ui/react";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 650px;
  margin: auto;
  text-align: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  grid-gap: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const FooterLink = styled.a`
  color: #000;
  margin-bottom: 20px;
  font-size: 18px;
  text-decoration: none;

  &:hover {
    color: #81E6D9;
    transition: 200ms ease-in;
    cursor: pointer;
  }
`;

const HeadingP = styled.p`
  font-size: 24px;
  color: #000;
  margin-bottom: 40px;
  font-weight: bold;
`;

function About() {
  return (
    <Box>
      <Heading as="h1" size="lg" mt={6} 
        mb={2} 
        textAlign={'center'}
        pt={1}
        pb={2}>
          About Us
        </Heading>
      <Divider my={6} />

      <Text mt={6} 
        mb={6} 
        textAlign={'center'}
        pt={1}
        pb={5}>
        Robbing Hood app aims to be an all-in-one stop shop for all your stock data needs.<br/>
        We want to allow users to search stock tickers in order to pull up information on the ticker price.<br/>
        We will also display analyst recommendations for the ticker. <br/>
        Visuals are also likely going to be implemented (increasing or decreasing price, tables).<br/>
        Accounts will serve as a way to allow for favoriting and tracking certain tickers.<br/>
        Lastly, we will display market news on its own page.<br/>
      </Text>

      <Divider my={6} />
      <Heading as="h1" size="lg" mt={6} 
        mb={6} 
        textAlign={'center'}
        pt={1}
        pb={5}>
        Creators
      </Heading>
    <Container>
    <Row>
      <Column>
      <HeadingP>Nelson</HeadingP>
        <FooterLink href="mailto:vandelin@oregonstate.edu">Email</FooterLink>
        <FooterLink href="https://www.linkedin.com/in/nelson-van-de-lindt/">Linkedin</FooterLink>
      </Column>
      <Column>
        <HeadingP>Khai</HeadingP>
        <FooterLink href="mailto:phankha@oregonstate.edu">Email</FooterLink>
        <FooterLink href="https://www.linkedin.com/in/khai-phan/">Linkedin</FooterLink>
      </Column>
      <Column>
        <HeadingP>Scot</HeadingP>
        <FooterLink href="mailto:reins@oregonstate.edu">Email</FooterLink>
        <FooterLink href="https://www.linkedin.com/in/scot-rein/">Linkedin</FooterLink>
      </Column>
    </Row>
  </Container>
  <Spacer mb={20} />
  </Box>
  )
}

export default About;
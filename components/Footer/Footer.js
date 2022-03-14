import React from "react";
import styled from "@emotion/styled";
import Link from 'next/link';
import { Heading } from "@chakra-ui/react";

const Box = styled.div`
  padding: 80px 60px;
  background: #1A202C;
  bottom: 0;
  width: 100%;
  margin-top:auto;

  @media (max-width: 1000px) {
    padding: 70px 30px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
  /* background: red; */
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 60px;
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
  color: #fff;
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
  color: #fff;
  margin-bottom: 40px;
  font-weight: bold;
`;

function Footer() {
  return (
    <Box>
      <Heading style={{ color: "teal", textAlign: "center", marginTop: "-50px" }}>
        Robbing Hood: Commission-free Stock Viewing App
      </Heading>
      <Container>
        <Row>
          <Column>
            
          </Column>
          <Column>
            <HeadingP>Services</HeadingP>
            <Link href="/dashboard"><FooterLink>Home</FooterLink></Link>
            <Link href="/search"><FooterLink>Search</FooterLink></Link>
            <Link href="/news"><FooterLink>News</FooterLink></Link>
            <Link href="/aboutus"><FooterLink>About Us</FooterLink></Link>
          </Column>
          <Column>
            <HeadingP>Contact Us</HeadingP>
            <FooterLink href="mailto:phankha@oregonstate.edu">Khai Phan</FooterLink>
            <FooterLink href="mailto:reins@oregonstate.edu">Scot Rein</FooterLink>
            <FooterLink href="mailto:vandelin@oregonstate.edu">Nelson van de Lindt</FooterLink>
          </Column>
          <Column>
            
          </Column>
        </Row>
      </Container>
    </Box>
  );
}

export default Footer;

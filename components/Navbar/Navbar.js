import Link from 'next/link';
import React, { useState } from 'react';
import { MenuItems } from './MenuItems';
import { NavButton } from './NavButton';
import { Icon, Flex } from '@chakra-ui/react';
import { useSession, signIn, signOut } from "next-auth/react";
import { IconContext } from 'react-icons';

import { FaBars, FaTimes} from 'react-icons/fa';
import { GiFeather } from 'react-icons/gi';

import styled from '@emotion/styled';
import { useRouter } from 'next/router';

//background color is equivalent to Chakra Blue 800
const Nav = styled.nav`
    background-color: #1A202C;
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;

    @media (max-width: 960px) {
        position: relative;
    }
`;

const NavBarLogo = styled.h1`
    color: #ffffff;
    justify-self: start;
    margin-left: 20px;
    cursor: pointer;
    font-size: 1.3rem;
    background-color: #38B2AC;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;

    @media (max-width: 960px) {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(25%, 50%);
    }
`;

const List = styled.ul`
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
    list-style: none;
    text-align: center;
    width: 70vw;
    justify-content: end;
    margin-right: 2rem;

    &.nav-menu {
        @media (max-width: 960px) {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            width: 100%;
            height: 60vh;
            position: absolute;
            top: 80px;
            left: -100%;
            opacity: 1;
            transition: all 0.5s ease;
        }

        &.active {
            @media (max-width: 960px) {
                background: #1A202C;
                z-index: 1;
                left: 0;
                opacity: 1;
                transition: all 0.5s ease;
            }
        }
    }
`;

const NavLink = styled.a`
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
        background-color: #6d76f7;
        border-radius: 4px;
        transition: all 0.2s ease-out;

        @media (max-width: 960px) {
            background-color: #285E61;
            border-radius: 0;
        }
    }

    &.mobile {
        display: none;

        @media (max-width: 960px) {
            display: block;
            text-align: center;
            padding: 1.5rem;
            margin: 2rem auto;
            border-radius: 4px;
            width: 80%;
            background: #4ad9e4;
            text-decoration: none;
            color: #ffffff;
            font-size: 1.5rem;
        }

        &:hover {
            background: #ffffff;
            color: #285E61;
            transition: 250ms;
        }
    }

    @media (max-width: 960px) {
        text-align: center;
        padding: 2rem;
        width: 100%;
        display: table;
        transition: all 0.5s ease;
    }
`;

const MenuIconDiv = styled.div`
    display: none;

    @media (max-width: 960px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 60%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

const MenuIcon = styled(Icon)`
    color: #ffffff;
`

function Navbar() {

    const { data: session } = useSession();

    const [ menuClicked, setMenuClicked ] = useState(false);

    const router = useRouter();

    const handleSignUp = (e) => {
        e.preventDefault();
        router.push("/users/signup");
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        router.push("/users/signin");
    }

    const handleLogo = (e) => {
        e.preventDefault();
        router.push("/dashboard");
    }

    const handleSignOut = (e) => {
        e.preventDefault();
        signOut({ callbackUrl: "/dashboard" });
    }

    return (
        <Nav>
            <NavBarLogo className='navbar-logo' onClick={handleLogo}>Robbing Hood</NavBarLogo>
            <MenuIconDiv className='menu-icon' onClick={() => setMenuClicked(!menuClicked)}>
                <MenuIcon as={menuClicked ? FaTimes : FaBars} />
            </MenuIconDiv>
            <List className={menuClicked ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link href={item.url}>
                                <NavLink className={item.cName}>
                                    {item.title}
                                </NavLink>
                            </Link>
                        </li>
                    )
                })}
            </List>
            {session ? 
                <NavButton onClick={handleSignOut}>Sign Out</NavButton> 
                :
                <Flex gap='12px'>
                    <NavButton onClick={handleSignIn}>Sign In</NavButton>
                    <NavButton onClick={handleSignUp}>Sign Up</NavButton>
                </Flex>
            }
        </Nav>
    )
}

export default Navbar;
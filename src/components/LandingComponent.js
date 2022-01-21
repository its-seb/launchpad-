import React, { Component } from "react";
import { Flex, Button, Box, Text, Select, Center, Spacer, Heading, HStack } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { Link as ReachLink } from "react-router-dom"
import { Grid, GridItem } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Scrollbar } from 'smooth-scrollbar-react';
import gif1 from "../assets/gif1.gif";
import gif2 from "../assets/gif2.gif";
import gif3 from "../assets/gif3.gif";
import magicdoor from "../assets/magic_door.png";
import logo from "../assets/launchpad_logo.svg";


export class LandingComponent extends Component {
  render() {
    return (
      <Flex minH="100vh">
        <Scrollbar
          plugins={{
            overscroll: {
              effect: 'bounce',
            },
          }}>
          <Box className="left_outer" width={{ '2xl': "74%", '3xl': "75.5%" }} bg="white">

            <Box className="navbar" w="90%" h="65px">
              <Link as={ReachLink} to='/collection'>
                <Image src={logo} alt='Dan Abramov' style={{ width: "210px", float: "left" }} />
              </Link>
              <Flex style={{ float: "right" }} >
                <a className="left_inner_text" href="https://www.youtube.com/watch?v=K9377oH1qVU">About</a>
                <a className="left_inner_text" href="https://www.youtube.com/watch?v=IqgERtJEgu8">Github</a>
                <a className="left_inner_text" href="https://www.youtube.com/watch?v=GvUqOA2ULoI">Get Started</a>
              </Flex>
            </Box>

            <Grid
              templateRows='repeat(3, 1fr)'
            >
              <GridItem rowSpan={30} h='400px' bg='white' >
                <Box>
                  <Box className="left_body" width={{ '2xl': "55%", '3xl': "60%" }}  >
                    <h1 className="first_row_title">
                      launchpad.
                    </h1>
                    <Text style={{ lineHeight: "180%" }} fontSize={{ '2xl': '2xl', '3xl': '2xl' }} w={{ '2xl': "450px", '3xl': "1000px" }}>A solution for artwork generation, decentralized storage & distribution of NFTs</Text>
                    <Text fontSize={{ '2xl': 'xl', '3xl': '2xl' }} color='purple'>No codes required!</Text>
                    <Text style={{ lineHeight: "190%" }} fontSize={{ '2xl': 'md', '3xl': 'xl' }} color='#2F4F4F'>Empowering artist by bridging the gap between artist and technology</Text>
                    <HStack style={{ marginTop: "20px" }}>
                      <Button colorScheme='facebook' h='50px'>
                        Generate Collections
                      </Button>
                      <Button colorScheme='twitter' h='50px'>
                        Bulk-mint Collections
                      </Button>
                    </HStack>
                  </Box>

                  <Box className="right_body" width={{ '2xl': "45%", '3xl': "40%" }}>
                    <img className="first_row_pic" src={magicdoor} ></img>
                  </Box>

                </Box>
              </GridItem>
              <GridItem rowSpan={25} h='400px' bg='#FAF8FC'>
                <Box>

                </Box>
              </GridItem>
              <GridItem rowSpan={25} h='400px' bg='white'>
                <img style={{ width: "200px", display: "inline-block" }} src={gif1}></img>
                <img style={{ width: "200px", display: "inline-block" }} src={gif2}></img>
                <img style={{ width: "200px", display: "inline-block" }} src={gif3}></img>

              </GridItem>
            </Grid>
          </Box>
        </Scrollbar>


        <Box
          width={{ '2xl': "26%", '3xl': "24.5%" }}
          bg="#202225"
          opacity="97%"
          color="white"
        >
          <Box className="right_outer">
            <Text fontSize="2xl">Welcome!</Text>
            <p>Sign in with your wallet to continue.</p>

            <Box my="20px">
              <label for="wallet" className="mb-2">Wallet:</label>
              <Select placeholder='Select option' name="wallet" mb="10px">
                <option value='icon_wallet'>ICON Wallet</option>
              </Select>

              <label for="network" className="mb-2">Network:</label>
              <Select placeholder='Select option' name="network">
                <option value='Sejong'>Testnet Sejong</option>
              </Select>
            </Box>

            <Button
              size='lg'
              height='48px'
              width='100%'
              border='2px'
              borderColor='purple'
              colorScheme='purple' variant='solid'
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Flex >
    );
  }
}

export default LandingComponent;

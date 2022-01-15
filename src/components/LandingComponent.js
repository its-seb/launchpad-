import React, { Component } from "react";
import { Flex, Button, Box, Text, Select, Center, Spacer, Heading } from '@chakra-ui/react'
import gif1 from "../assets/gif1.gif";
import gif2 from "../assets/gif2.gif";
import gif3 from "../assets/gif3.gif";

export class LandingComponent extends Component {
  render() {
    return (
      <Flex minH="100vh">
        <Box width={{ sm: "74%", xl: "75.5%" }} bg="white">
          Information Here
        </Box>
        <Box
          width={{ sm: "26%", xl: "24.5%" }}
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

          <Box className="right_inner">
            <h1>&copy; 2022 Launchpad</h1>
          </Box>

        </Box>
      </Flex >

    );
  }
}

export default LandingComponent;

import React, { Component } from "react";
import { Flex, Spacer, Box, Text, Heading } from '@chakra-ui/react'
import gif1 from "../assets/gif1.gif";
import gif2 from "../assets/gif2.gif";
import gif3 from "../assets/gif3.gif";

export class LandingComponent extends Component {
  render() {
    return (
      <Flex minH="100vh">
        <Box width={{ sm: '74%', xl: '75.5%' }} bg='white'>
          Information Here
        </Box>
        <Box width={{ sm: '26%', xl: '24.5%' }} bg='#202225' opacity="97%" color="white">
          <Box className="right_outer">
            <Text fontSize='2xl'>Welcome!</Text>
            <p>Sign in with your wallet to continue.</p>
          </Box>
        </Box>
      </Flex>

    );
  }
}

export default LandingComponent;

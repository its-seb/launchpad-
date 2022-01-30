import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link as RouteLink,
} from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import ICONexConnection from "./utils/interact.js";
import { UserIcon } from "@heroicons/react/solid";

export class NavigationComponent extends Component {
  connection = new ICONexConnection();

  handleWalletEvent = async (event) => {
    localStorage.removeItem("USER_WALLET_ADDRESS");
    localStorage.removeItem("SELECTED_CONTRACT_ADDRESS");
    localStorage.removeItem("HAS_METAHASH");
    window.location.assign("/");

    event.preventDefault();
  };

  render() {
    return (
      <>
        <Box bg={"#202225"} h="70" px={"5"}>
          <Flex
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            p={2}
            mx="auto"
            maxW="1300px"
            h="100%"
            borderBottom="1px solid #363636"
          >
            <Box>
              <Link
                as={RouteLink}
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                to="/collection"
                _hover={{ color: "white" }}
              >
                &lt;/&gt; launchpad
              </Link>
            </Box>
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={UserIcon}
                    bg="#202225"
                    border="1px solid white"
                  />
                </MenuButton>
                <MenuList>
                  {/* <MenuItem>Change Wallet</MenuItem> */}
                  <MenuItem onClick={this.handleWalletEvent}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Box>
      </>
    );
  }
}

export default NavigationComponent;

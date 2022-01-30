import React, { Component } from "react";
import {
  Image,
  Flex,
  Button,
  Box,
  Text,
  Center,
  SimpleGrid,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ICONexConnection from "./utils/interact.js";
import book from "../assets/book.png";
import dice from "../assets/dice.png";
import gift from "../assets/gift-box.png";
import scroll from "../assets/scroll.png";
import wand from "../assets/wand.png";
import ticket from "../assets/ticket.png";

export class LandingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { featureone: true, featuretwo: false };
    this.handleClick = this.handleClick.bind(this);
  }
  connection = new ICONexConnection();

  handleClick(e, feature) {
    if (feature == "one") {
      this.setState({ featureone: true });
      this.setState({ featuretwo: false });
    } else {
      this.setState({ featuretwo: true });
      this.setState({ featureone: false });
    }
  }

  handleWalletEvent = async (event) => {
    if (localStorage.getItem("USER_WALLET_ADDRESS") == null) {
      //signing in
      let _walletAddress = await this.connection.getWalletAddress();
      if (_walletAddress != null) {
        localStorage.setItem("USER_WALLET_ADDRESS", _walletAddress);
        console.log(localStorage.getItem("USER_WALLET_ADDRESS"));
        window.location.assign("/collection");
      } else {
        console.log("user cancelled login");
      }
    }

    event.preventDefault();
  };

  render() {
    return (
      <>
        <Flex minH="100vh" overflow="hidden">
          <Box width={{ xl: "100%" }} mt="90px" px="10rem">
            <Box
              width={{
                one: "450px",
                two: "500px",
                four: "500px",
                five: "600px",
                six: "700px",
              }}
            >
              <Text
                as="span"
                fontFamily="mono"
                fontWeight="600"
                bg="#202225"
                color="white"
                fontSize="l"
                p="0.5rem"
              >
                &#60;/&#62; launchpad.
              </Text>
            </Box>
            <Box
              textStyle="h3"
              fontSize={["3rem", "5rem"]}
              fontFamily="sans-serif"
              width={{
                one: "700px",
                two: "500px",
                four: "500px",
                five: "600px",
                six: "60vw",
              }}
              pt="1.5rem"
              color="#3e3e3e"
              fontWeight="600"
            >
              A solution for artwork generation, decentralized storage &
              distribution of NFTs
            </Box>

            <Box
              mt="2.5rem"
              width={{
                one: "700px",
                two: "500px",
                four: "500px",
                five: "600px",
                six: "60vw",
              }}
            >
              <Button
                size="lg"
                height="48px"
                variant="solid"
                mr="1rem"
                background="gray.200"
                _hover={{ bg: "gray.300" }}
                as="a"
                href="https://github.com/boonyeow/launchpad-nusfintech"
                target="_blank"
              >
                Github
              </Button>
              <Button
                size="lg"
                height="48px"
                variant="solid"
                mr="1rem"
                background="gray.200"
                _hover={{ bg: "gray.300" }}
                as="a"
                href="https://www.youtube.com/embed/AKQmBX1JLU4"
                target="_blank"
              >
                Demo
              </Button>
              <Button
                size="lg"
                height="48px"
                variant="solid"
                color="white"
                bg="#202225"
                _hover={{ bg: "gray.700" }}
                onClick={this.handleWalletEvent}
              >
                Connect Wallet
              </Button>
            </Box>
            <Box mt="2.5rem">
              <Text fontSize="2rem" fontWeight="600" color="">
                Services
              </Text>
              <Tabs
                variant="soft-rounded"
                colorScheme="gray"
                orientation="vertical"
                pt="1rem"
                IsFitted
              >
                <TabList>
                  <Tab mb="1rem" width="12rem">
                    Art Generator
                  </Tab>
                  <Tab width="12rem">Collection Dispenser</Tab>
                </TabList>
                <TabPanels pt="0">
                  <TabPanel>
                    <div>
                      <SimpleGrid
                        bg="gray.50"
                        columns="3"
                        rounded="lg"
                        color="black"
                        spacing="2rem"
                      >
                        <Box
                          boxShadow="md"
                          marginBottom={"5px"}
                          rounded="md"
                          bg="white"
                          paddingLeft={"4"}
                          paddingRight={"4"}
                          paddingBottom={"4"}
                          paddingTop={"2"}
                        >
                          <Flex>
                            <Box flex="1" textAlign="center">
                              <Center w="80px" margin="auto">
                                <Image
                                  src={book}
                                  maxW={"80px"}
                                  display={"inline-block"}
                                  paddingTop={"4"}
                                />
                              </Center>
                              <Text
                                display={"block"}
                                fontWeight={"bold"}
                                paddingBottom={"1"}
                                fontSize="1.2rem"
                                textAlign="center"
                                pt="8px"
                                color="#3e3e3e"
                              >
                                Easy To Use
                              </Text>

                              <Text
                                color="#2F4F4F"
                                fontSize={{ one: "12px", five: "14px" }}
                                textAlign={"justify"}
                                marginLeft={"10px"}
                              >
                                No coding required. Create your layers, import
                                your assets and generate your artwork!
                              </Text>
                            </Box>
                          </Flex>
                        </Box>

                        <Box
                          boxShadow="md"
                          marginBottom={"5px"}
                          rounded="md"
                          bg="white"
                          paddingLeft={"4"}
                          paddingRight={"4"}
                          paddingBottom={"4"}
                          paddingTop={"2"}
                        >
                          <Flex>
                            <Box flex="1" textAlign="center">
                              <Center w="80px" margin="auto">
                                <Image
                                  src={dice}
                                  maxW={"80px"}
                                  display={"inline-block"}
                                  paddingTop={"4"}
                                />
                              </Center>
                              <Text
                                display={"block"}
                                fontWeight={"bold"}
                                paddingBottom={"1"}
                                fontSize="1.2rem"
                                textAlign="center"
                                pt="8px"
                                color="#3e3e3e"
                              >
                                Attribute Rarity
                              </Text>
                              <Text
                                color="#2F4F4F"
                                fontSize={{ one: "12px", five: "14px" }}
                                textAlign={"justify"}
                                marginLeft={"10px"}
                              >
                                Easily configure certain attributes to be more
                                rarer than others.
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                        <Box
                          boxShadow="md"
                          marginBottom={"5px"}
                          rounded="md"
                          bg="white"
                          paddingLeft={"4"}
                          paddingRight={"4"}
                          paddingBottom={"4"}
                          paddingTop={"2"}
                        >
                          <Flex>
                            <Box flex="1" textAlign="center">
                              <Center w="80px" margin="auto">
                                <Image
                                  src={gift}
                                  maxW={"80px"}
                                  display={"inline-block"}
                                  paddingTop={"4"}
                                />
                              </Center>
                              <Text
                                display={"block"}
                                fontWeight={"bold"}
                                paddingBottom={"1"}
                                fontSize="1.2rem"
                                textAlign="center"
                                pt="8px"
                                color="#3e3e3e"
                              >
                                Metadata
                              </Text>
                              <Text
                                color="#2F4F4F"
                                fontSize={{ one: "12px", five: "14px" }}
                                textAlign={"justify"}
                                marginLeft={"10px"}
                              >
                                Generate metadata compliant with ERC-721
                                standard for easy integration with marketplaces
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </SimpleGrid>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <SimpleGrid
                        bg="gray.50"
                        columns="3"
                        rounded="lg"
                        color="black"
                        spacing="2rem"
                      >
                        <Box
                          boxShadow="md"
                          marginBottom={"5px"}
                          rounded="md"
                          bg="white"
                          paddingLeft={"4"}
                          paddingRight={"4"}
                          paddingBottom={"4"}
                          paddingTop={"2"}
                        >
                          <Flex>
                            <Box flex="1" textAlign="center">
                              <Center w="70px" margin="auto">
                                <Image
                                  src={scroll}
                                  maxW={"70px"}
                                  display={"inline-block"}
                                  paddingTop={"4"}
                                />
                              </Center>
                              <Text
                                display={"block"}
                                fontWeight={"bold"}
                                paddingBottom={"1"}
                                fontSize="1.2rem"
                                textAlign="center"
                                pt="8px"
                                color="#3e3e3e"
                              >
                                Create NFT Collection
                              </Text>
                              <Text
                                color="#2F4F4F"
                                fontSize={{ one: "12px", five: "14px" }}
                                textAlign={"justify"}
                                marginLeft={"10px"}
                              >
                                Deploy NFT contract on ICON Network for low
                                transaction fees
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                        <Box
                          boxShadow="md"
                          marginBottom={"5px"}
                          rounded="md"
                          bg="white"
                          paddingLeft={"4"}
                          paddingRight={"4"}
                          paddingBottom={"4"}
                          paddingTop={"2"}
                        >
                          <Flex>
                            <Box flex="1" textAlign="center">
                              <Center w="70px" margin="auto">
                                <Image
                                  src={ticket}
                                  maxW={"70px"}
                                  display={"inline-block"}
                                  paddingTop={"4"}
                                />
                              </Center>
                              <Text
                                display={"block"}
                                fontWeight={"bold"}
                                paddingBottom={"1"}
                                fontSize="1.2rem"
                                textAlign="center"
                                pt="8px"
                                color="#3e3e3e"
                              >
                                Upload Assets to IPFS
                              </Text>
                              <Text
                                color="#2F4F4F"
                                fontSize={{ one: "12px", five: "14px" }}
                                textAlign={"justify"}
                                marginLeft={"10px"}
                              >
                                Store your images, gifs and metadata on
                                decentralized cloud for zero downtime and
                                resistance to DDoS attacks & censorship
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                        <Box
                          boxShadow="md"
                          marginBottom={"5px"}
                          rounded="md"
                          bg="white"
                          paddingLeft={"4"}
                          paddingRight={"4"}
                          paddingBottom={"4"}
                          paddingTop={"2"}
                        >
                          <Flex>
                            <Box flex="1" textAlign="center">
                              <Center w="70px" margin="auto">
                                <Image
                                  src={wand}
                                  maxW={"70px"}
                                  display={"inline-block"}
                                  paddingTop={"4"}
                                />
                              </Center>
                              <Text
                                display={"block"}
                                fontWeight={"bold"}
                                paddingBottom={"1"}
                                fontSize="1.2rem"
                                textAlign="center"
                                pt="8px"
                                color="#3e3e3e"
                              >
                                Launch your own minting dApp
                              </Text>
                              <Text
                                color="#2F4F4F"
                                fontSize={{ one: "12px", five: "14px" }}
                                textAlign={"justify"}
                                marginLeft={"10px"}
                              >
                                Just like Wix, create and configure your very
                                own dApp to distribute your collection.
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </SimpleGrid>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Flex>
      </>
    );
  }
}

export default LandingComponent;

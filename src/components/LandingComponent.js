import React, { Component } from "react";
import { Image, Grid, GridItem, Flex, Button, Box, Text, Select, Center, HStack, ButtonGroup, SimpleGrid } from '@chakra-ui/react'
import { Scrollbar } from 'smooth-scrollbar-react';
import ICONexConnection from "./utils/interact.js";
import gif1 from "../assets/gif1.gif";
import gif2 from "../assets/gif2.gif";
import gif3 from "../assets/gif3.gif";
import logo from "../assets/launchpad_logo.svg";
import book from "../assets/book.png";
import dice from "../assets/dice.png";
import gift from "../assets/gift-box.png";
import scroll from "../assets/scroll.png";
import wand from "../assets/wand.png";
import ticket from "../assets/ticket.png";
import { BsGithub } from 'react-icons/bs';
import { AiOutlineMedium } from "react-icons/ai";


export class LandingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { featureone: true, featuretwo: false, };
    this.handleClick = this.handleClick.bind(this);
  }
  connection = new ICONexConnection();

  handleClick(e, feature) {
    if (feature == "one") {
      this.setState({ featureone: true });
      this.setState({ featuretwo: false });
    }
    else {
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
      <Flex minH="100vh" overflow={"hidden"} >
        <Box width={{ 'xl': "75%" }}>
          <Grid
            templateRows='repeat(10, 1fr)'
            h={'100%'}
          >
            <GridItem bg="white" rowSpan={5}>
              <Grid
                h={'100%'}
                templateColumns='repeat(7, 1fr)'
                gap={0}
              >
                <GridItem colSpan={4}>
                  <Image src={logo} alt='Dan Abramov' width={"250px"} marginLeft={"30px"} marginTop={"10px"} />

                  <Flex h='100%' paddingTop={"50px"} display={"block"} paddingLeft={"40px"}>
                    <Box textStyle='h1' width={{ one: "450px", two: "500px", four: "500px", five: "600px", six: "700px" }}> A solution for artwork generation, decentralized storage & distribution of NFTs</Box>
                    <Box textStyle='h2' color='purple' marginTop={"5px"} py={"10px"}>No codes required!</Box>
                    <Text color='#2F4F4F' fontSize={{ one: "16px", two: "16px", four: "17px", "five": "18px", "six": "23px" }} width={{ one: "500px", two: "500px", four: "600px", five: "600px", six: "700px" }}>Empowering artist by bridging the gap between artist and technology</Text>
                    <HStack marginTop={"15px"}>
                      <Button bg="#E6E6FA" leftIcon={<BsGithub size={25} />} h='40px' border='1px'
                        borderColor='black' width='140px' as='a' href='https://github.com/boonyeow/launchpad' target="_blank">
                        Github
                      </Button>
                      <Button bg='#F0F8FF' leftIcon={<AiOutlineMedium size={25} />} h='40px' border='1px'
                        borderColor='black' width='140px'>
                        Medium
                      </Button>
                    </HStack>
                  </Flex>
                </GridItem>
                <GridItem colSpan={3}>
                  <Center h='100%' marginRight={{ one: "20px", two: "25px", four: "55px", "five": "60px", "six": "100px" }}>
                    <Image src={gif1} display="inline-block" boxSize={{ one: "180px", two: "200px", three: "210px", four: "220px", five: "230px", six: '280px' }} ></Image>
                    <Image display="inline-block" boxSize={{ one: "180px", two: "200px", three: "210px", four: "220px", five: "230px", six: '280px' }} src={gif2}></Image>
                    <Image display="inline-block" boxSize={{ one: "180px", two: "200px", three: "210px", four: "220px", five: "230px", six: '280px' }} src={gif3}></Image>
                  </Center>
                </GridItem>
              </Grid>
            </GridItem>


            <GridItem bg='#faf8fc' rowSpan={5}>
              <Grid
                h={'100%'}
                templateColumns='repeat(8, 1fr)'
                gap={0}
                marginTop={{ six: "10px" }}
              >
                <GridItem colSpan={5} marginRight={"auto"} marginLeft={"auto"} >
                  <Box>
                    <Box textStyle='h3' color='#2F4F4F' textAlign={"center"} marginBottom={"20px"} marginTop={"10px"}>How does it work?</Box>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/AKQmBX1JLU4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </Box>

                </GridItem>
                <GridItem colSpan={3} marginRight={{ one: "30px", six: "60px" }}>
                  <Box textStyle='h3' color='#2F4F4F' textAlign={"center"} marginTop={"10px"} marginBottom={"5px"}>Our Features</Box>
                  <Box textAlign={"center"} >


                    <ButtonGroup variant='ghost' spacing='20' color='#2F4F4F'>
                      <Button colorScheme='purple' isActive={this.state.featureone}
                        onClick={(e) => this.handleClick(e, "one")}
                      >
                        <Text>Art Generator</Text>
                      </Button>

                      <Button colorScheme='purple' isActive={this.state.featuretwo}
                        onClick={(e) => this.handleClick(e, "tw0")}

                      >
                        <Text >Bulk Minting</Text>
                      </Button>
                    </ButtonGroup>
                  </Box>

                  <Center h='70%' display={"block"} marginTop={"10px"}>
                    {this.state.featureone
                      ?
                      <div>
                        <SimpleGrid
                          bg='gray.50'
                          columns='1'
                          rounded='lg'
                          color='black'
                        >
                          <Box boxShadow='md' marginBottom={"5px"} rounded='md' bg='white' paddingLeft={'4'} paddingRight={'4'} paddingBottom={'4'} paddingTop={'2'}>
                            <Flex>
                              <Center w='50px'>
                                <Image src={book} maxW={"50px"} display={"inline-block"} paddingTop={'4'} />
                              </Center>
                              <Box flex='1' textAlign='center'>
                                <Text color='#2F4F4F' display={"block"} fontWeight={"semibold"} paddingBottom={'1'} marginRight={"20px"}>Easy To Use </Text>
                                <Text color='#2F4F4F' fontSize={{ one: "12px", five: "14px" }} textAlign={"justify"} marginLeft={"10px"}>No coding required. Create your layers, import your assets, click Generate and you are done!
                                </Text>

                              </Box>
                            </Flex>
                          </Box>
                          <Box boxShadow='md' marginBottom={"5px"} rounded='md' bg='white' paddingLeft={'4'} paddingRight={'4'} paddingBottom={'4'} paddingTop={'2'}>
                            <Flex>
                              <Center w='50px'>
                                <Image src={gift} maxW={"50px"} display={"inline-block"} paddingTop={'4'} />
                              </Center>
                              <Box flex='1' textAlign='center'>
                                <Text color='#2F4F4F' display={"block"} fontWeight={"semibold"} paddingBottom={'1'} marginRight={"20px"}>Export to images or gifs</Text>
                                <Text color='#2F4F4F' fontSize={{ one: "12px", five: "14px" }} textAlign={"justify"} marginLeft={"10px"}>You can import images and gifs and we will generate your collection in the specific format.
                                </Text>

                              </Box>
                            </Flex>
                          </Box>
                          <Box boxShadow='md' marginBottom={"5px"} rounded='md' bg='white' paddingLeft={'4'} paddingRight={'4'} paddingBottom={'4'} paddingTop={'2'}>
                            <Flex>
                              <Center w='50px'>
                                <Image src={dice} maxW={"50px"} display={"inline-block"} paddingTop={'4'} />
                              </Center>
                              <Box flex='1' textAlign='center'>
                                <Text color='#2F4F4F' display={"block"} fontWeight={"semibold"} paddingBottom={'1'} marginRight={"20px"}>Layer and Attribute Rarity </Text>
                                <Text color='#2F4F4F' fontSize={{ one: "12px", five: "14px" }} textAlign={"justify"} marginLeft={"10px"}>Easily configure certain layers and attributes to be more rare than others.
                                </Text>

                              </Box>
                            </Flex>
                          </Box>

                        </SimpleGrid>
                      </div>


                      :
                      <div>
                        <SimpleGrid
                          bg='gray.50'
                          columns='1'
                          rounded='lg'
                          color='black'
                        >
                          <Box boxShadow='md' marginBottom={"5px"} rounded='md' bg='white' paddingLeft={'4'} paddingRight={'4'} paddingBottom={'4'} paddingTop={'2'}>
                            <Flex>
                              <Center w='50px'>
                                <Image src={scroll} maxW={"50px"} display={"inline-block"} paddingTop={'4'} />
                              </Center>
                              <Box flex='1' textAlign='center'>
                                <Text color='#2F4F4F' display={"block"} fontWeight={"semibold"} paddingBottom={'1'} marginRight={"20px"}>Deploy Smart Contract</Text>
                                <Text color='#2F4F4F' fontSize={{ one: "12px", five: "14px" }} textAlign={"justify"} marginLeft={"10px"}>Customize and Deploy a smart contract to ICON for every art collection of yours!
                                </Text>

                              </Box>
                            </Flex>
                          </Box>
                          <Box boxShadow='md' marginBottom={"5px"} rounded='md' bg='white' paddingLeft={'4'} paddingRight={'4'} paddingBottom={'4'} paddingTop={'2'}>
                            <Flex>
                              <Center w='50px'>
                                <Image src={wand} maxW={"50px"} display={"inline-block"} paddingTop={'4'} />
                              </Center>
                              <Box flex='1' textAlign='center'>
                                <Text color='#2F4F4F' display={"block"} fontWeight={"semibold"} paddingBottom={'1'} marginRight={"20px"}>Generate your own unqiue dApp</Text>
                                <Text color='#2F4F4F' fontSize={{ one: "12px", five: "14px" }} textAlign={"justify"} marginLeft={"10px"}>Just like Wix, create and configure your very own dApp to sell your collection.
                                </Text>

                              </Box>
                            </Flex>
                          </Box>
                          <Box boxShadow='md' marginBottom={"5px"} rounded='md' bg='white' paddingLeft={'4'} paddingRight={'4'} paddingBottom={'4'} paddingTop={'2'}>
                            <Flex>
                              <Center w='50px'>
                                <Image src={ticket} maxW={"50px"} display={"inline-block"} paddingTop={'4'} />
                              </Center>
                              <Box flex='1' textAlign='center'>
                                <Text color='#2F4F4F' display={"block"} fontWeight={"semibold"} paddingBottom={'1'} marginRight={"20px"}>Bulk Minting from your Collection </Text>
                                <Text color='#2F4F4F' fontSize={{ one: "12px", five: "14px" }} textAlign={"justify"} marginLeft={"10px"}>Market your generated dApp and allow users around the world to bulk mint your collection!
                                </Text>

                              </Box>
                            </Flex>
                          </Box>

                        </SimpleGrid>
                      </div>


                    }

                  </Center>
                </GridItem>
              </Grid>

            </GridItem>
          </Grid>
        </Box >


        <Box
          width={{ 'xl': "25%" }}
          bg="#202225"
          opacity="97%"
          color="white"
        >
          <Box position={"relative"} margin={0} top={"45%"} left={"50%"} transform={"translate(-50%, -50%)"} display={"inline-block"} maxW={"100%"} marginLeft={"auto"} marginRight={"auto"}>
            <Text fontSize="2xl">Welcome!</Text>
            <p>Sign in with your wallet to continue.</p>

            <Box my="20px">
              <label for="wallet" className="mb-2">Wallet:</label>
              <Select placeholder='Select option' name="wallet" mb="10px">
                <option value='icon_wallet' selected>ICON Wallet</option>
              </Select>

            </Box>

            <Button
              size='lg'
              height='48px'
              width='100%'
              border='2px'
              borderColor='purple'
              colorScheme='purple' variant='solid'
              onClick={this.handleWalletEvent}
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

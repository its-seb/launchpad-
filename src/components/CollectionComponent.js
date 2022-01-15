import React, { Component } from "react";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/solid";
import {
  BrowserRouter as Router,
  Route,
  Link as RouteLink,
} from "react-router-dom";
import NewCollectionModal from "./NewCollectionModal.js";
import Dexie from "dexie";
import ICONexConnection from "./utils/interact.js";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Text,
  SimpleGrid,
  Box,
  Stack,
  Link,
} from "@chakra-ui/react";
import { AddIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import "./style.css";
export class CollectionComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCollectionModal: false,
      contractInfo: [],
      contractInfoLength: 0,
      walletAddress: null,
    };
    this.showCollectionModal = this.showCollectionModal.bind(this);
    this.hideCollectionModal = this.hideCollectionModal.bind(this);
    this.getContractInfo = this.getContractInfo.bind(this);

    this.db = new Dexie("contracts_deployed");
    this.db.version(1).stores({
      contracts: "contractAddress, walletAddress, name, symbol, metahash_exist",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });
  }
  connection = new ICONexConnection();

  async componentDidMount() {
    //document.getElementById("_pageTitle").innerText = this.props.pageTitle;

    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    if (walletAddress != null) {
      this.getContractInfo(walletAddress);
    } else {
      console.log("hello refreshed");
    }
  }

  componentWillReceiveProps(props) {
    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    if (walletAddress != null) {
      this.setState({ walletAddress: walletAddress });
      this.getContractInfo(walletAddress);
    } else {
      //***should we clear it tho? load gonna be slow if they always signout; meaning it'll always fallback
      this.db.contracts.clear();
      this.setState({ contractInfo: [] });
    }
  }

  showCollectionModal = () => {
    this.setState({ showCollectionModal: true });
  };

  hideCollectionModal = () => {
    this.setState({ showCollectionModal: false });
  };

  getContractInfo = async (walletAddress) => {
    //check indexedDB data; if exists, pull contract info, else fallback
    console.log("this.state.walletAddress", this.state.walletAddress);
    console.log("this.props.walletAddress", this.props.walletAddress);
    const contractsCount = await this.db.contracts
      .where({
        walletAddress: walletAddress,
      })
      .count((count) => {
        return count;
      });

    if (contractsCount == 0) {
      this.db.contracts.clear();
      //fallback to check tx list for confirmation
      let contractDisplay = await this.connection.getLaunchpadContracts(
        walletAddress
      );
      //prepare statement for bulk add to db.contracts
      let contractsToCommit = [];
      console.log(contractDisplay);
      for (let contract of contractDisplay) {
        let metahashExist = await this.connection.hasMetahash(
          contract.contractAddress
        );
        contractsToCommit.push({
          contractAddress: contract.contractAddress,
          walletAddress: walletAddress,
          name: contract.name,
          symbol: contract.symbol,
          metahash_exist: metahashExist,
        });
      }
      this.db.contracts
        .bulkAdd(contractsToCommit)
        .then((lastKey) => {
          console.log("last key added:", lastKey);
        })
        .catch(Dexie.BulkError, (e) => {
          console.error(
            "Some contracts were not appended. However, " +
              contractDisplay.length -
              e.failures.length +
              " contracts was added successfully"
          );
        });
      //console.log(contractsToCommit);
    }
    const contractsDeployed = await this.db.contracts
      .where({
        walletAddress: walletAddress,
      })
      .toArray();
    console.log("contracts deployed", contractsDeployed);
    this.setState({ contractInfo: contractsDeployed });
    this.setState({ contractInfoLength: contractsDeployed.length });
  };

  handleCardEvent = (contractAddress, hasMetahash) => {
    localStorage.setItem("SELECTED_CONTRACT_ADDRESS", contractAddress);
    localStorage.setItem("HAS_METAHASH", hasMetahash);
  };

  render() {
    return (
      <>
        <Stack flexDirection="row">
          <Box mt="1rem">
            <Link variant="current" href="/collection">
              Collection
            </Link>
          </Box>
          <Stack justifyContent="flex-end" flexDirection="row" w="100%">
            <Link as={RouteLink} pr="0" mt="0.5rem" to="/generate">
              Generate
            </Link>
          </Stack>
        </Stack>

        <SimpleGrid columns={[1, 1, 2, 4]} spacing={"1rem"} mt="0.5rem">
          <Box
            type="button"
            bg={"#fed428"}
            p="6px 15px 10px 15px"
            borderRadius="xl"
            onClick={this.showCollectionModal}
            mt="0.5rem"
          >
            <Flex>
              <Text
                fontSize="1.8rem"
                fontWeight="bold"
                w="100%"
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                New Collection
                <AddIcon w="1rem" h="1rem" mt="13px" float="right" />
              </Text>
            </Flex>
            <Text fontSize="0.9rem">deploy a new nft contract</Text>
          </Box>

          {this.state.contractInfo.map((info) => (
            <RouteLink to="/file">
              <Box
                mt="0.5rem"
                type="button"
                bg={"#2f3136"}
                color="white"
                p="6px 15px 10px 15px"
                borderRadius="xl"
                _hover={{ backgroundColor: "#393c43", color: "white" }}
                onClick={() =>
                  this.handleCardEvent(
                    info.contractAddress,
                    info.metahash_exist
                  )
                }
                to="/file"
              >
                <Flex as="a" _hover={{ color: "white" }}>
                  <Text fontSize="1.8rem" fontWeight="bold" w="100%">
                    {info.name}
                    <ArrowForwardIcon
                      w="1rem"
                      h="1rem"
                      mt="13px"
                      float="right"
                    />
                  </Text>
                </Flex>
                <Text
                  fontSize="0.9rem"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {info.contractAddress}
                </Text>
              </Box>
            </RouteLink>
          ))}
        </SimpleGrid>
        <Modal
          closeOnOverlayClick={false}
          isOpen={this.state.showCollectionModal}
          onClose={this.hideCollectionModal}
        >
          <ModalOverlay />
          <ModalContent bg="#2f3136" color="white" borderRadius={"xl"}>
            <ModalHeader borderBottom="1px solid #4c4c4c">
              Create a new collection
            </ModalHeader>
            <ModalCloseButton t={4} />
            <ModalBody pb={2} pt={2}>
              <FormControl>
                <FormLabel>Collection Name</FormLabel>
                <Input
                  placeholder="Token Symbol"
                  borderColor="#4c4c4c"
                  _focus={{ outlineColor: "#4c4c4c", outlineOffset: "0" }}
                  placeholder="Collection Name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Token Symbol</FormLabel>
                <Input
                  placeholder="Token Symbol"
                  borderColor="#4c4c4c"
                  _focus={{ outlineColor: "#4c4c4c", outlineOffset: "0" }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={this.hideCollectionModal}
                mr={3}
                bg="#2f3136"
                _hover={{ backgroundColor: "#2f3136" }}
                _active={{ backgroundColor: "#2f3136" }}
                _focus={{ boxShadow: "0" }}
              >
                Cancel
              </Button>
              <Button
                bg="#fed428"
                color="#2f3136"
                _hover={{ backgroundColor: "#fed428", boxShadow: "0" }}
                _active={{ backgroundColor: "#fed428" }}
                _focus={{ boxShadow: "0" }}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
}

export default CollectionComponent;

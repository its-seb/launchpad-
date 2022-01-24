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
import { Flex, Text, SimpleGrid, Box, Stack, Link } from "@chakra-ui/react";
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
            onClick={this.showCollectionModal}
            layerStyle="card_new_collection"
          >
            <Flex>
              <Text layerStyle="card_title">New Collection</Text>
              <AddIcon layerStyle="card_icon" />
            </Flex>
            <Text layerStyle="card_content">deploy a new nft contract</Text>
          </Box>

          {this.state.contractInfo.map((info, i) => (
            <RouteLink to="/file" key={i}>
              <Box
                layerStyle="card_collection"
                type="button"
                onClick={() =>
                  this.handleCardEvent(
                    info.contractAddress,
                    info.metahash_exist
                  )
                }
                to="/file"
              >
                <Flex _hover={{ color: "white" }}>
                  <Text layerStyle="card_title">{info.name}</Text>
                  <ArrowForwardIcon layerStyle="card_icon" />
                </Flex>
                <Text layerStyle="card_content">{info.contractAddress}</Text>
              </Box>
            </RouteLink>
          ))}
        </SimpleGrid>
        <NewCollectionModal
          show={this.state.showCollectionModal}
          hide={this.hideCollectionModal}
          updateContractInfo={this.getContractInfo}
        />
      </>
    );
  }
}

export default CollectionComponent;

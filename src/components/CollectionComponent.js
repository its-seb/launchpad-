import React, { Component } from "react";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/solid";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import NewCollection from "./NewCollection.js";
import NewCollectionModal from "./NewCollectionModal.js";
import cfg from "../config.json";
import Dexie from "dexie";
import ICONexConnection from "./utils/interact.js";
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
      contracts: "contractAddress, walletAddress, name, symbol",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });
  }
  connection = new ICONexConnection();

  componentDidMount() {
    document.getElementById("_pageTitle").innerText = this.props.pageTitle;
    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    if (walletAddress != null) {
      this.getContractInfo(walletAddress);
    }
    //this.getContractInfo();
  }

  componentWillReceiveProps(props) {
    console.log("receiving", props.walletAddress);
    if (props.walletAddress != null) {
      this.setState({ walletAddress: props.walletAddress });
      this.getContractInfo(props.walletAddress);
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
      //fallback to check tx list for confirmation
      let contractDisplay = await this.connection.getLaunchpadContracts(
        walletAddress
      );

      //prepare statement for bulk add to db.contracts
      let contractsToCommit = [];
      console.log(contractDisplay);
      for (let contract of contractDisplay) {
        contractsToCommit.push({
          contractAddress: contract.contractAddress,
          walletAddress: walletAddress,
          name: contract.name,
          symbol: contract.symbol,
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

  handleCardEvent = (contractAddress) => {
    localStorage.setItem("SELECTED_CONTRACT_ADDRESS", contractAddress);
  };

  render() {
    return (
      <div style={{ height: "75vh", overflowY: "auto" }}>
        <Container>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={6} md={4} lg={3}>
              <Card
                className="contract-card unselectable"
                type="button"
                onClick={this.showCollectionModal}
              >
                <div style={{ display: "flex" }}>
                  <span>
                    New Collection
                    <PlusIcon></PlusIcon>
                  </span>
                </div>
                <span>deploy a new nft contract</span>
              </Card>
            </Col>
            {this.state.contractInfo.map((info) => (
              <Col xs={6} md={4} lg={3} key={info.contractAddress}>
                <Link
                  to={"files"}
                  className="contractLink"
                  onClick={() => this.handleCardEvent(info.contractAddress)}
                >
                  <Card className="contract-card unselectable">
                    <div style={{ display: "flex" }}>
                      <span>
                        {info.name}
                        <ArrowRightIcon></ArrowRightIcon>
                      </span>
                    </div>
                    <span>{info.contractAddress}</span>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
        <Modal
          show={this.state.showCollectionModal}
          onHide={this.hideCollectionModal}
        >
          <NewCollectionModal updateContractInfo={this.getContractInfo} />
        </Modal>
      </div>
    );
  }
}

export default CollectionComponent;

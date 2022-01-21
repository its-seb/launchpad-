import React, { Component } from "react";
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
  Spinner,
  Text,
} from "@chakra-ui/react";
import IconService from "icon-sdk-js";
import Dexie from "dexie";
import Swal from "sweetalert2";
import FailureComponent from "./FailureComponent.js";
import SuccessComponent from "./SuccessComponent.js";
import { fetchContractContent } from "./utils/fetchContractContent.js";
import ICONexConnection, {
  estimateStepsforDeployment,
  sleep,
} from "./utils/interact.js";
import "./style.css";
import cfg from "../config.json";
const { IconConverter, IconBuilder, HttpProvider } = IconService;
class NewCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showStatusModal: false,
    };

    this.db = new Dexie("contracts_deployed");
    this.db.version(1).stores({
      contracts: "contractAddress, walletAddress, name, symbol",
    });
    this.db.open().catch((error) => {
      console.log("error", error);
    });

    this.tbCollectionName = React.createRef();
    this.tbCollectionSymbol = React.createRef();
    this.deployText = React.createRef();
  }

  connection = new ICONexConnection();

  handleDeployContract = async () => {
    //checks before proceeding for deployment
    const walletAddress = localStorage.getItem("USER_WALLET_ADDRESS");
    const collectionName = this.tbCollectionName.current.value;
    const collectionSymbol = this.tbCollectionSymbol.current.value;

    if (walletAddress == null) {
      alert("Please connect your wallet.");
      return;
    } else if (!collectionName.length || !collectionSymbol.length) {
      //remember to sanitize input-> allow alphanumeric only
      Swal.fire({
        title: "Oops...",
        icon: "error",
        text: "Make sure you have entered the mandatory fields",
      }); //do consider replacing this -boon
      return;
    }

    const contractContent = await fetchContractContent(
      "https://gateway.pinata.cloud/ipfs/QmcGEfBjWyHntPh9xAasAK4UcvG5GL7VrtUZguWfpooNky"
    );

    let deploymentSuccess = document.getElementById("deploymentSuccess");
    let deploymentFailure = document.getElementById("deploymentFailure");
    let deploymentStatusText = document.getElementById("deployText");
    this.props.hide();
    this.setState({ showStatusModal: true });

    console.log(deploymentStatusText);
    deploymentStatusText.innerText = "deploying collection...";
    deploymentStatusText.style.display = "block";

    const txParams = {
      _name: collectionName, //based on user input
      _symbol: collectionSymbol, //based on user input
    };
    const stepLimitInHex = await estimateStepsforDeployment(
      walletAddress,
      contractContent,
      txParams
    );

    console.log("steplimitinhex", stepLimitInHex);

    const stepLimit = IconConverter.toNumber(stepLimitInHex);
    const txObj = new IconBuilder.DeployTransactionBuilder()
      .nid("0x53") //0x53 for sejong - https://www.icondev.io/introduction/the-icon-network/testnet
      .from(walletAddress)
      .to(cfg.ZERO_ADDRESS) //constant
      .stepLimit(IconConverter.toBigNumber(stepLimit))
      .version(IconConverter.toBigNumber(3)) //constant
      .timestamp(Date.now() * 1000) //constant
      .contentType("application/zip") //.py score
      .content(contractContent)
      .nonce(IconConverter.toBigNumber(1))
      .params(txParams)
      .build();

    //console.log(txObj);
    const payload = {
      jsonrpc: "2.0",
      method: "icx_sendTransaction",
      id: 6639,
      params: IconConverter.toRawTransaction(txObj),
    };

    try {
      let rpcResponse = await this.connection.getJsonRpc(payload);
      const txHash = rpcResponse.result;
      console.log("txHash", txHash);

      const provider = new HttpProvider(
        "https://sejong.net.solidwallet.io/api/v3"
      );
      const iconService = new IconService(provider);
      await sleep(5000);
      const txObject = await iconService.getTransactionResult(txHash).execute();
      console.log("txObject", txObject);
      //update indexedDB
      this.db.contracts
        .add({
          contractAddress: txObject.scoreAddress,
          walletAddress: walletAddress,
          name: collectionName,
          symbol: collectionSymbol,
          metahash_exist: 0,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
      this.props.updateContractInfo(walletAddress);

      deploymentSuccess.style.display = "block";
      deploymentStatusText.innerText = "new collection has been created";
      await sleep(2000);
      deploymentSuccess.style.display = "none";
      deploymentStatusText.style.display = "none";
      this.props.hideModal();
    } catch (e) {
      ////alert("User cancelled transaction");
      deploymentFailure.style.display = "block";
      deploymentStatusText.innerText = "deployment cancelled by user";
      await sleep(2000);
      deploymentStatusText.style.display = "none";
      deploymentFailure.style.display = "none";

      console.log(e); //handle error here (e.g. user cancelled transaction; show message)
    }
  };

  render() {
    return (
      <>
        <Modal
          closeOnOverlayClick={false}
          isOpen={this.props.show}
          onClose={this.props.hide}
        >
          <ModalOverlay />
          <ModalContent bg="#2f3136" color="white" borderRadius={"xl"}>
            <ModalHeader borderBottom="1px solid #4c4c4c">
              Create a new collection
            </ModalHeader>
            <ModalCloseButton top={4} />
            <ModalBody pb={2} pt={2}>
              <FormControl>
                <FormLabel>Collection Name</FormLabel>
                <Input
                  ref={this.tbCollectionName}
                  focusBorderColor="#4c4c4c"
                  borderColor="#4c4c4c"
                  placeholder="Collection Name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Token Symbol</FormLabel>
                <Input
                  ref={this.tbCollectionSymbol}
                  focusBorderColor="#4c4c4c"
                  placeholder="Token Symbol"
                  borderColor="#4c4c4c"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={this.props.hide} variant="modal_cancel">
                Cancel
              </Button>
              <Button
                variant="modal_submit"
                onClick={this.handleDeployContract}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal closeOnOverlayClick={false} isOpen={this.state.showStatusModal}>
          <ModalOverlay />
          <ModalContent bg="#2f3136" color="white" borderRadius={"xl"}>
            <ModalBody py={10} textAlign="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                w="5rem"
                h="5rem"
                borderColor="#626262"
              ></Spinner>
              <SuccessComponent id="deploymentSuccess" />
              <FailureComponent id="deploymentFailure" />
              <Text fontSize="1.2rem" pt="15px" id="deployText">
                deploying collection...
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
}

export default NewCollectionModal;

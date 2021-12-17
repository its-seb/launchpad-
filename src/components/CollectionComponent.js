import React, { Component } from "react";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/solid";
import NewCollection from "./NewCollection.js";
import "./style.css";

export class CollectionComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCollectionModal: false,
    };
    this.showCollectionModal = this.showCollectionModal.bind(this);
    this.hideCollectionModal = this.hideCollectionModal.bind(this);
  }

  componentDidMount() {
    document.getElementById("_pageTitle").innerText = this.props.pageTitle;
  }

  handleNewCollection = () => {
    this.showCollectionModal();
  };

  showCollectionModal = () => {
    this.setState({ showCollectionModal: true });
  };

  hideCollectionModal = () => {
    this.setState({ showCollectionModal: false });
  };

  render() {
    return (
      <div>
        <Container>
          <Row style={{ marginTop: "10px" }}>
            <Col xs={6} md={4} lg={3}>
              <Card
                className="card unselectable"
                type="button"
                onClick={this.handleNewCollection}
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
            <Col xs={6} md={4} lg={3}>
              <Card className="card unselectable">
                <div style={{ display: "flex" }}>
                  <span>
                    Collection 039
                    <ArrowRightIcon></ArrowRightIcon>
                  </span>
                </div>
                <span>hxbd1375315c7732779edaa4c3903ffc9b93e82ca3</span>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.showCollectionModal}>
          <NewCollection />
        </Modal>
      </div>
    );
  }
}

export default CollectionComponent;

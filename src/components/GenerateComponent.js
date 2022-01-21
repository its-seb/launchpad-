import React, { Component } from "react";
import { Text, Grid, GridItem, Box, Button } from "@chakra-ui/react";
import { AddIcon } from '@chakra-ui/icons';
import { Container, Col, Row, InputGroup, SplitButton, FormControl, Modal } from "react-bootstrap";
import Dexie from 'dexie';
import imageStyle from "./TestImage.module.css";
import SortableComponent from "./LayerDnd";
import db from "../db.js"
// import GenerateNFT from "./GenerateNFT.jsx";

export class GenerateComponent extends Component {
  blobData = [];
  imageData = [];
  layerName = [];
  constructor(props) {
    super(props);

    //this.retrieveLayers();
    //this.viewLayerImages({ id: 1, name: "background" });

    this.state = {
      file: this.blobData,
      image: this.imageData,
      layer: this.layerName,
      currentLayer: "",
      currentLayerId: 0,
      newLayer: "",
      slidingImageTimeout: 0,
      slidingLayerTimeout: 0,
      typingLayerTimeout: 0
    };
  }

  componentDidMount() {
    this.retrieveLayers();
    this.viewLayerImages({ id: 1, name: "background" });
  }

  //Retrieve all unique layers in the database
  retrieveLayers = async () => {
    var count = await db.layerNames.orderBy('layer').count();
    //console.log(count);

    if (count === 0) {
      await db.layerNames.add({
        layer: "background",
        index: 0,
        rarity: 100
      });
      this.layerName.push({
        name: "background",
        layerid: 1,
        index: 0,
        rarity: 100
      });
    } else {
      this.layerName.length = 0;
      await db.layerNames.orderBy('index').toArray()
        .then(theList => {
          theList.forEach(item => {
            //console.log(item.id);
            this.layerName.push({
              name: item.layer,
              layerid: item.id,
              index: item.index,
              rarity: item.rarity,
              xOffset: 0,
              yOffset: 0
            });
          })
        });

    }
    this.setState({ layer: this.layerName }, () => {
      console.log(this.state.layer);
    });

  };

  handleLayerRarityChange = async (event) => {
    event.preventDefault();
    let objIndex = this.layerName.findIndex((obj => obj.layerid === parseInt(event.target.id)));
    this.layerName[objIndex].rarity = parseFloat(event.target.value);

    if (this.state.slidingLayerTimeout) {
      clearTimeout(this.state.slidingLayerTimeout);
    };

    this.setState({
      layer: this.layerName,
      slidingLayerTimeout: setTimeout(function () {
        console.log("Uploaded rarity changes to db");
        console.log(event.target.value);
        db.layerNames.update(parseInt(event.target.id), { rarity: parseFloat(event.target.value) });
      }, 500)
    });

  }

  // Updates **images database of new rarity adjusted by the range slider
  handleRarityChange = async (event) => {
    event.preventDefault();
    //Finds image in this.imageData and changes the rarity value according to the slider value
    let objIndex = this.imageData.findIndex((obj => obj.imageID === parseInt(event.target.id)));
    this.imageData[objIndex].rarity = parseFloat(event.target.value);

    //fancy js method of adding up values in array XD
    var totalRarity = this.imageData.reduce((a, b) => a + parseFloat((b['rarity'] || 0)), 0);

    //Re-computing the rarity percentage for each image
    this.imageData.forEach(image => {
      image.rarityPercent = (image.rarity / totalRarity) * 100;
      image.rarityPercent = Math.round(image.rarityPercent * 100) / 100;
    });

    //If user continues sliding will reset the timeout counter
    if (this.state.slidingImageTimeout) {
      clearTimeout(this.state.slidingImageTimeout);
    }

    //reset the states of sliding back to false, and set delay for db to update. If user stops sliding that shit it will update in 1sec (1000 milisecs)
    // ** can test the console when you slide, when it uploads to db it will display
    this.setState({
      image: this.imageData,
      // sliding: false,
      slidingImageTimeout: setTimeout(function () {
        console.log("Uploaded rarity changes to db");
        db.layers.update(parseInt(event.target.id), { rarity: parseFloat(event.target.value) });
      }, 500)
    });

  }

  // Computes total rarity value
  computeImageRarity = async (layer) => {
    var totalRarity = 0;

    await db.layers
      .where('layerid')
      .equals(layer.id)
      .toArray()
      .then(theList => {
        theList.forEach(item => {
          if (item.image !== undefined) {
            totalRarity = totalRarity + item.rarity;
          }
        });
      });
    return totalRarity;
  }

  // Querying database (Select * From LayersDB Where layerID = xxxxxx)
  queryDatabase = async (layerid) => {
    this.imageData.length = 0;
    const allLayers = await db.layers
      .where('layerid').equals(layerid)
      .toArray();

    return allLayers;
  };


  // View images inside layers
  viewLayerImages = async (layer) => {
    var count = await db.layers.where('layerid').equals(layer.id).count();
    this.setState({
      currentLayer: layer.name,
      currentLayerId: layer.id,
    }, () => {
      // console.log("image state", this.state.image);
      //console.log("Current Layer", this.state.currentLayer);
    });

    this.imageData.length = 0;

    //Check if layer has images
    if (count !== 0) {
      var totalRarity = await this.computeImageRarity(layer);
      await this.queryDatabase(layer.id)
        .then(theList => {
          theList.forEach(item => {
            if (item.image !== undefined) {
              const imgBlob = URL.createObjectURL(item.image);
              // compute rarity percentage
              var rarity = (item.rarity / totalRarity) * 100;
              rarity = Math.round(rarity * 100) / 100;
              this.imageData.push({ imageID: item.id, name: item.name, blob: imgBlob, rarity: item.rarity, rarityPercent: rarity });
            }
          });
        });

    };

    this.setState({ image: this.imageData }, () => {
      // console.log("image state", this.state.image);
      //console.log("Current Layer", this.state.currentLayer);
    });
  }


  // Adding uploaded image to database
  addToDatabase = async (files) => {
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      // console.log("files", files[fileIndex]);
      await db.layers.add({
        //id: Math.random(),
        layerid: this.state.currentLayerId,
        layer: this.state.currentLayer,
        name: files[fileIndex].name,
        image: files[fileIndex],
        rarity: 50
      });
    }
    this.setState({ file: this.blobData }, () => {
      this.viewLayerImages({
        name: this.state.currentLayer,
        id: this.state.currentLayerId
      });
    });
  };

  // Run function upon upload
  handleDropEvent = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (this.validateFileExtension(files)) {
      console.log("allowed");
      this.addToDatabase(files);
    } else {
      console.log("not allowed");
    };
  };

  handleBrowseFiles = (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (this.validateFileExtension(files)) {
      console.log("allowed");
      this.addToDatabase(files);
    } else {
      console.log("not allowed");
    };
  };

  validateFileExtension = (files) => {
    var allowedTypes = ["jpg", "jpeg", "bmp", "gif", "png", "PNG"];
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      if (allowedTypes.includes(files[fileIndex].name.split('.').pop()) === false) {
        return false;
      }
    };
    return true;
  }

  handleLayerNameChange = (event) => {
    var id = parseInt(this.state.currentLayerId);
    let objIndex = this.layerName.findIndex((obj => obj.layerid === id));
    this.layerName[objIndex].name = event.target.value;

    if (this.state.typingLayerTimeout) {
      clearTimeout(this.state.typingLayerTimeout);
    }

    this.setState({
      currentLayer: event.target.value,
      typingLayerTimeout: setTimeout(async function () {
        // Update layers database
        await new GenerateComponent().queryDatabase(id).then(theList => {
          theList.forEach(item => {
            if (item.layerid === id) {
              db.layers.update(item.id, { layer: event.target.value });
            };
          });
        });
        // Update layerNames database
        db.layerNames.update(id, { layer: event.target.value });

      }, 5000)
    });
  };

  // Adds layer name to state upon input by users 
  handleNewLayer = (event) => {
    this.setState({ newLayer: "event.target.value" });
  };

  // Adding new layers
  addNewLayer = async () => {
    console.log("adding layer");
    var count = await db.layerNames.orderBy("id").count();

    await db.layerNames.add({
      layer: "",
      index: count,
      rarity: 100
    });

    this.retrieveLayers();

  };

  // Deletes selected image
  deleteSingleImage = async (imageID) => {
    await db.layers.where("id").equals(imageID).delete();
    await this.viewLayerImages({
      id: this.state.currentLayerId,
      name: this.state.currentLayer
    });
  }

  // For layerdnd.jsx to call
  handleToUpdate = async () => {
    //this.setState({layer: args});
    await this.retrieveLayers();
  }
  render() {
    return (
      <>
        <Grid
          h='90vh'
          templateRows='repeat(12, 1fr)'
          templateColumns='repeat(12, 1fr)'
          gap={6}
          pt={5}
        >
          <GridItem rowSpan={6} colSpan={4} bg='#292929' p={5} borderRadius="7">
            <Text fontWeight="bold" pb={3} color="#FBFBFB">Layers</Text>
            <Box overflow="auto" height="70%">
              <SortableComponent
                layerName={this.layerName.slice(1)}
                handleToUpdate={this.handleToUpdate}
                viewLayerImages={this.viewLayerImages}
                handleShow={this.handleShow}
                retrieveLayers={this.retrieveLayers}
              />
            </Box>
            <Button
              leftIcon={<AddIcon />}
              fontWeight="bold"
              mt={3}
              pos="relative"
              borderRadius="7"
              colorScheme="yellow"
              color="#292929"
              alignContent="center"
              pl="89px"
              pr="89px"
              pt="26px"
              pb="26px"
              ml={5}
              onClick={this.addNewLayer}
            >
              Add New Layer
            </Button>
          </GridItem>
          <GridItem rowSpan={1} colSpan={8} bg='papayawhip' />
          <GridItem rowSpan={5} colSpan={8} bg='papayawhip' />
          <GridItem rowSpan={6} colSpan={4} bg='#292929' p={5} overflow="auto" borderRadius="7">
          </GridItem>
          <GridItem rowSpan={6} colSpan={3} bg='tomato' />
          <GridItem rowSpan={6} colSpan={5} bg='papayawhip' />
        </Grid>
        <div
          style={{
            padding: "25px 25px",
            border: "1px solid #5d2985",
            borderRadius: "0.25rem",
            height: "50vh",
            overflowY: "auto",
            width: "50%",
            float: "right"
          }}
          onDrop={this.handleDropEvent}
          onDragOver={(event) => {
            event.preventDefault();
          }}
        >
          <span style={{ color: "#5d2985" }}>Drag & Drop Files / </span>

          <label onChange={this.handleBrowseFiles} htmlFor="browseFiles" style={{ color: "red", cursor: "pointer" }}>
            <input
              type="file"
              id="browseFiles"
              ref={(input) => (this.fileUploader = input)}
              multiple
              accept="image/png, image/jpeg"
              hidden
            ></input>
            Upload
          </label>

          <div
            id="gallery"
            style={{ paddingTop: this.imageData.length === 0 ? "0px" : "25px" }}
          >
            <Row>
              {(this.state.image || []).map((data, i) => (
                <Col key={i} xs={2} style={{ marginBottom: "15px" }}>
                  <div style={{ padding: "5px" }}>
                    <img
                      src={data.blob}
                      style={{
                        width: "100%",
                        display: "block",
                        margin: "auto",
                        border: "1px solid #c9c9c9",
                      }}
                    ></img>
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                      {data.name}
                    </span>
                    <span onClick={() => this.deleteSingleImage(data.imageID)} style={{ float: "right", color: "red", fontWeight: "bold", cursor: "pointer" }}>X</span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Layers card */}
        <div className={` card text-white bg-dark mb-3 ${imageStyle.cardContainer}`}>
          <div className="card-header">
            <Row>
              <Col>
                <span>Layers</span>
              </Col>
              <Col>
                <InputGroup size="sm" style={{ float: "right" }}>
                  <FormControl value={this.state.newLayer} onChange={this.handleNewLayer} placeholder="Add a New Layer" />
                  <Button variant="secondary" style={{ fontSize: "15px" }} onClick={this.addNewLayer} disabled={this.state.newLayer === "" ? true : false} >+</Button>
                </InputGroup>
              </Col>
            </Row>
          </div>
          <div className={`card-body ${imageStyle.cardBody}`}>
            <Row>
              <div style={{ marginBottom: "-16px" }}>
                <ul>
                  <span className={imageStyle.layerButton} onClick={() => this.viewLayerImages({ id: 1, name: "background" })}>background</span>
                </ul>
              </div>
              <SortableComponent
                layerName={this.layerName.slice(1)}
                handleToUpdate={this.handleToUpdate}
                viewLayerImages={this.viewLayerImages}
                handleShow={this.handleShow}
                retrieveLayers={this.retrieveLayers}
              />
            </Row>
          </div>
        </div >

        {/* Layer settings card  */}
        < div className={`card text-white bg-dark mb-3 ${imageStyle.cardContainer}`
        }>
          <div className="card-header">
            <span>Layer Settings</span>
            {this.state.currentLayerId === 1 ?
              <input style={{ float: "right", backgroundColor: "transparent", border: "none", color: "white", textAlign: "right" }} type="text" value={this.state.currentLayer} disabled />
              :
              <input onChange={this.handleLayerNameChange} style={{ float: "right", backgroundColor: "transparent", border: "none", color: "white", textAlign: "right" }} type="text" value={this.state.currentLayer} />
            }
          </div>
          <div className={`card-body ${imageStyle.cardBody}`}>
            <div>
              <Row style={{ paddingBottom: "15px", paddingTop: "10px" }}>
                <Col className="col-5">
                  <span>{this.state.currentLayer}'s Rarity</span>
                </Col>
                <Col className="col-5">
                  <input id={this.state.currentLayerId} type="range" min="1" max="100" step="1" value={this.layerName.filter(x => x.layerid === this.state.currentLayerId).map(x => x.rarity)} class={imageStyle.raritySlider} onChange={this.handleLayerRarityChange}></input> {''}
                </Col>
                <Col>
                  <span>{this.layerName.filter(x => x.layerid === this.state.currentLayerId).map(x => x.rarity)}%</span>
                </Col>
              </Row>
            </div>
            {(Object.keys(this.state.image).length !== 0) ? (this.state.image || []).map((data, i) => (
              <div>
                <Row style={{ paddingBottom: "15px", paddingTop: "10px" }} key={i}>
                  <Col key={i} className="col-5">
                    <span>{data.name}</span>
                  </Col>
                  <Col className="col-5">
                    <input id={data.imageID} type="range" min="1" max="100" step="1" value={data.rarity} class={imageStyle.raritySlider} onChange={this.handleRarityChange}></input> {''}
                  </Col>
                  <Col>
                    <span>{data.rarityPercent}%</span>
                  </Col>
                </Row>
              </div>
            )) : <div> <p>* Upload images to start *</p></div>}
          </div>
        </div >
        <div style={{ height: "auto", width: "auto" }}>
          {/* <GenerateNFT layers={this.state.layer} /> */}
          {/* <canvas id="previewNFT"></canvas> */}
        </div>
      </>
    );
  }
}

export default GenerateComponent;

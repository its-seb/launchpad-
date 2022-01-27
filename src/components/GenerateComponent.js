import React, { Component } from "react";
import {
  Text,
  Grid,
  GridItem,
  Box,
  Button,
  SimpleGrid,
  Image as Img,
  Input,
  Textarea,
  Icon,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Container,
  Col,
  Row,
  InputGroup,
  SplitButton,
  Modal,
  Form
} from "react-bootstrap";
import Dexie from "dexie";
import imageStyle from "./TestImage.module.css";
import SortableComponent from "./LayerDnd";
import db from "../db.js";
import { Scrollbar } from "smooth-scrollbar-react";
import { XCircleIcon, UploadIcon, PencilAltIcon } from "@heroicons/react/solid";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// import GenerateNFT from "./GenerateNFT.jsx";

function MergeImages(props) {
  //console.log(props);
  //var result = [];
  const layers = props.layers;
  //console.log(props);

  const initialize = (images) => {
    // images are loaded here 
    const canvas = document.createElement("canvas");
    canvas.width = props.width;
    canvas.height = props.height;

    const ctx = canvas.getContext("2d");

    Object.values(images).forEach((e, index) => {
      for (let i = 0; i < Object.keys(layers).length; i++) {
        if (layers[i].layerid === parseInt(e.alt)) {
          var w = e.width;
          var h = e.height;
          var hRatio = canvas.width / w;
          var vRatio = canvas.height / h;
          var ratio = Math.min(hRatio, vRatio);
          ctx.drawImage(e, layers[i].xOffset, layers[i].yOffset, w, h, 0, 0, w * ratio, h * ratio);
        }
      }
    });

    //BASE 64
    const img = canvas.toDataURL();
    return img;

    // Blob
    // canvas.toBlob(function(blob){
    //     canvas.href = URL.createObjectURL(blob);
    //     //console.log(blob);
    //     //console.log(canvas.href); // this line should be here
    //     result.push(canvas.href);
    // });

  };

  const result = Promise.all(Object.keys(props.images).map((e, i) =>
    new Promise((resolve, reject) => {
      var imageObj = [];
      imageObj[i] = new Image();
      imageObj[i].onload = () => resolve(imageObj[i]);
      imageObj[i].onerror = reject;
      imageObj[i].src = props.images[e].image;
      imageObj[i].alt = props.images[e].id;
    })
  )).then(images => {
    //console.log(images);
    var imgResult = initialize(images);
    console.log(imgResult);
    return imgResult
  });

  //console.log(result);
  return result;
}

function GetImageData(files, imageId) {
  var result = [];
  imageId = parseInt(imageId);
  Object.keys(files).map((item, index) => {
    if (Object.keys(files[item]["layerImages"]).length !== 0) {
      const images = files[item]["layerImages"];

      Object.keys(images).map((image) => {
        if (images[image].imageId === imageId) {
          //console.log(images[image].imageData);
          result.push({ id: images[image].layerId, image: images[image].imageData });
        }
      });
    }
  });

  return result[0];
}

function product(left, right, other) {
  if (other) {
    right = product.apply(this, [].slice.call(arguments, 1));
  }

  return left.reduce(function (ret, i) {
    var ans = right.map(function (j) {
      return [i].concat(j);
    });

    return ret.concat(ans);
  }, []);
}

function count(animals) {
  return animals.reduce((acc, arr) => {
    for (const item of arr) {
      acc[item] = acc[item] !== undefined ? acc[item] + 1 : 1
    }
    return acc
  }, {})
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function GetMergedImages(props) {
  var indexes = [];
  var imagesToGenerate = parseInt(props.count);
  var allImages = [];
  let files = props.files;
  const noOfLayers = Object.keys(files).length;
  var compiledListOfIds = [];

  for (let i = 0; i < noOfLayers; i++) {
    indexes[i] = [];
    var listOfImageIds = [];

    const totalRarity = files[i].totalRarity

    //check if theres any images in the layer
    if (totalRarity !== 0) {

      const layerRarity = files[i].layerRarity;
      const layersToGenerate = Math.round((layerRarity / 100) * imagesToGenerate);
      indexes[i]["layerCount"] = layersToGenerate;

      var layerCountRemaining = layersToGenerate;
      var layersComputed = 0;

      //Calculate the individual images
      for (var image in files[i].layerImages) {
        const imageRarity = files[i].layerImages[image].imageRarity;
        const imageId = files[i].layerImages[image].imageId;

        const imageCount = Math.round((imageRarity / totalRarity) * layersToGenerate);

        indexes[i].push({ [imageId]: imageCount });
        layerCountRemaining = layerCountRemaining - imageCount;
        layersComputed = layersComputed + imageCount;

        listOfImageIds = listOfImageIds.concat(Array(1).fill(imageId));
      }

      // //Deal with Remainders
      if (layersComputed !== layersToGenerate) {
        //Overgenerate
        if (layersComputed > indexes[i].layerCount) {
          for (let x = 0; x < layersComputed - layersToGenerate; x++) {

            const noOfIds = listOfImageIds.length;
            var randomId = listOfImageIds[Math.floor(Math.random() * noOfIds)];;

            for (var image in indexes[i]) {
              const total = indexes[i][image][Object.keys(indexes[i][image])[0]];
              if (parseInt(Object.keys(indexes[i][image])[0]) === randomId) {
                indexes[i][image][Object.keys(indexes[i][image])[0]] = total - 1;
                break;
              }
            }
          }
        } else if (layersComputed < indexes[i].layerCount) {
          //Undergenerate
          for (let x = 0; x < layersToGenerate - layersComputed; x++) {

            const noOfIds = listOfImageIds.length;
            var randomId = listOfImageIds[Math.floor(Math.random() * noOfIds)];;

            for (var image in indexes[i]) {
              const total = indexes[i][image][Object.keys(indexes[i][image])[0]];
              if (parseInt(Object.keys(indexes[i][image])[0]) === randomId) {
                indexes[i][image][Object.keys(indexes[i][image])[0]] = total + 1;
                break;
              }
            }
          }
        }
      }
      compiledListOfIds.push(listOfImageIds);

    } else {
      indexes[i]["layerCount"] = 0;
    }
  }

  //Remove empty layers before processing
  for (let i = indexes.length - 1; i >= 0; i--) {
    if (indexes[i].layerCount === 0) {
      indexes.splice(i, 1);
    }
  }

  console.log("Indexes", indexes);

  //Fill compiledListOfIds with 0 if the layer is required to generate lesser than total amt
  //Populate rest of ids with 0
  for (let i = 0; i < indexes.length; i++) {
    console.log(imagesToGenerate);
    if (indexes[i].layerCount !== imagesToGenerate && indexes[i].layerCount !== 0) {
      compiledListOfIds[i] = compiledListOfIds[i].concat(Array(1).fill(0));
    }
  }

  console.log("All Ids", compiledListOfIds);

  const allTotalCombinations = product.apply(null, compiledListOfIds);
  console.log(allTotalCombinations);

  const totalCombinationCount = count(allTotalCombinations);
  console.log(totalCombinationCount);

  shuffle(allTotalCombinations);

  var layerWithLeastCounts = 0;
  var layerCounter = 0;
  for (let i = 0; i < indexes.length; i++) {
    var onlyValidValues = indexes[i].filter(v => v !== 'layerCount');
    for (let j = 0; j < onlyValidValues.length; j++) {
      const currentImageId = parseInt(Object.keys(onlyValidValues[j])[0]);
      const currentImageCount = onlyValidValues[j][currentImageId];
      if (currentImageCount < layerCounter) {
        layerWithLeastCounts = i;
      }
      layerCounter = currentImageCount;
    }
  }

  for (let i = 0; i < indexes.length; i++) {
    if (i === layerWithLeastCounts) {
      //ImageIds in the current layer
      var imageIds = compiledListOfIds[i];

      var onlyValidValues = indexes[i].filter(v => v !== 'layerCount');
      //Iterate each layer in indexes to find out the counts
      for (let j = 0; j < onlyValidValues.length; j++) {
        const currentImageId = parseInt(Object.keys(onlyValidValues[j])[0]);
        const currentImageCount = onlyValidValues[j][currentImageId];
        const imagesToRemove = totalCombinationCount[currentImageId] - currentImageCount;

        var removedId = 0;
        var stop = false;
        while (!stop) {
          for (let j = allTotalCombinations.length - 1; j >= 0; j--) {
            if (currentImageId === allTotalCombinations[j][i]) {
              allTotalCombinations.splice(j, 1);
              removedId++;

              if (removedId === imagesToRemove) {
                break;
              }
            }
          }
          if (removedId === imagesToRemove) {
            stop = true;
          }
        }
      }
      break;
    }
  }

  console.log(allTotalCombinations);

  console.log(count(allTotalCombinations));

  for (let i = 0; i < allTotalCombinations.length; i++) {
    var images = [];
    for (let j = 0; j < allTotalCombinations[i].length; j++) {
      const imageId = allTotalCombinations[i][j];
      if (imageId !== 0) {
        const imageData = GetImageData(files, imageId);
        images.push(imageData);
      }
    }
    allImages.push(images);
  }

  console.log("All Layer Images", allImages);

  //Merge Images
  var mergedImages = [];
  for (let i = 0; i < Object.keys(allImages).length; i++) {
    const img = await MergeImages({
      images: allImages[i],
      height: 100,
      width: 100,
      layers: props.layers
    });
    mergedImages.push(img);
  }
  console.log("Merged Images ", mergedImages);

  var zip = new JSZip();

  //zip.file("Hello.txt", "Hello World\n");
  var images = zip.folder("images");
  var metadata = zip.folder("metadata");

  for (let i = 0; i < allTotalCombinations.length; i++) {
    var obj = new Object();
    const no = (i + 1).toString();

    obj.name = "#" + no;
    obj.description = "";
    obj.external_url = "";
    obj.image = no + ".png";

    var counter = 0;
    obj.attributes = [];
    for (let j = 0; j < allTotalCombinations[i].length; j++) {
      Object.keys(files).map((item, index) => {
        if (Object.keys(files[item]["layerImages"]).length !== 0) {
          const layerName = files[item]["layerName"];
          const images = files[item]["layerImages"];
          const imageId = allTotalCombinations[i][j];

          Object.keys(images).map((image) => {
            if (images[image].imageId === imageId) {
              obj.attributes[counter] = new Object();
              console.log(layerName);
              obj.attributes[counter].trait_type = layerName;

              const layerValue = images[image].imageName.substr(0, images[image].imageName.lastIndexOf("."));
              obj.attributes[counter].value = layerValue;
              counter++;
            }
          });
        }
      });
    }

    obj.properties = new Object();
    obj["properties"].category = "image";
    obj["properties"].files = [];
    obj["properties"]["files"][0] = new Object();
    obj["properties"]["files"][0].uri = no + ".png";
    obj["properties"]["files"][0].type = "image/png";
    obj.compiler = "Launchpad";

    console.log(JSON.stringify(obj, null, '\t'));

    metadata.file(no + ".json", JSON.stringify(obj, null, '\t'));
  }

  for (let i = 0; i < mergedImages.length; i++) {
    var idx = mergedImages[i].indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
    var content = mergedImages[i].substring(idx);
    images.file(i + 1 + ".png", content, { base64: true });
  }

  await zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "files.zip");
  });

  return mergedImages;
}

function getUniqueCount(props) {
  var indexes = [];
  let files = props.files;
  const noOfLayers = Object.keys(files).length;
  var compiledListOfIds = [];

  for (let i = 0; i < noOfLayers; i++) {
    var listOfImageIds = [];
    const totalRarity = files[i].totalRarity

    //check if theres any images in the layer
    if (totalRarity !== 0) {
      //Calculate the individual images
      for (var image in files[i].layerImages) {
        const imageId = files[i].layerImages[image].imageId;
        listOfImageIds = listOfImageIds.concat(Array(1).fill(imageId));
      }

      compiledListOfIds.push(listOfImageIds);

    }
  }

  const allTotalCombinations = product.apply(null, compiledListOfIds);

  var imagesToGenerate = allTotalCombinations.length;
  for (let i = 0; i < noOfLayers; i++) {
    indexes[i] = [];
    const totalRarity = files[i].totalRarity

    //check if theres any images in the layer
    if (totalRarity !== 0) {

      const layerRarity = files[i].layerRarity;
      const layersToGenerate = Math.round((layerRarity / 100) * imagesToGenerate);
      indexes[i]["layerCount"] = layersToGenerate;

      var layerCountRemaining = layersToGenerate;
      var layersComputed = 0;

      //Calculate the individual images
      for (var image in files[i].layerImages) {
        const imageRarity = files[i].layerImages[image].imageRarity;
        const imageId = files[i].layerImages[image].imageId;

        const imageCount = Math.round((imageRarity / totalRarity) * layersToGenerate);

        indexes[i].push({ [imageId]: imageCount });
        layerCountRemaining = layerCountRemaining - imageCount;
        layersComputed = layersComputed + imageCount;
      }

      // //Deal with Remainders
      if (layersComputed !== layersToGenerate) {
        //Overgenerate
        if (layersComputed > indexes[i].layerCount) {
          for (let x = 0; x < layersComputed - layersToGenerate; x++) {

            const noOfIds = listOfImageIds.length;
            var randomId = listOfImageIds[Math.floor(Math.random() * noOfIds)];;

            for (var image in indexes[i]) {
              const total = indexes[i][image][Object.keys(indexes[i][image])[0]];
              if (parseInt(Object.keys(indexes[i][image])[0]) === randomId) {
                indexes[i][image][Object.keys(indexes[i][image])[0]] = total - 1;
                break;
              }
            }
          }
        } else if (layersComputed < indexes[i].layerCount) {
          //Undergenerate
          for (let x = 0; x < layersToGenerate - layersComputed; x++) {

            const noOfIds = listOfImageIds.length;
            var randomId = listOfImageIds[Math.floor(Math.random() * noOfIds)];;

            for (var image in indexes[i]) {
              const total = indexes[i][image][Object.keys(indexes[i][image])[0]];
              if (parseInt(Object.keys(indexes[i][image])[0]) === randomId) {
                indexes[i][image][Object.keys(indexes[i][image])[0]] = total + 1;
                break;
              }
            }
          }
        }
      }
    } else {
      indexes[i]["layerCount"] = 0;
    }
  }

  //Remove empty layers before processing
  for (let i = indexes.length - 1; i >= 0; i--) {
    if (indexes[i].layerCount === 0) {
      indexes.splice(i, 1);
    }
  }

  console.log(indexes);
  console.log(count(allTotalCombinations));

  const totalCombinations = count(allTotalCombinations);
  var additionalDuplicates = 0;

  for (let i = 0; i < indexes.length; i++) {
    var onlyValidValues = indexes[i].filter(v => v !== 'layerCount');
    for (let j = 0; j < onlyValidValues.length; j++) {
      const currentImageId = parseInt(Object.keys(onlyValidValues[j])[0]);
      const currentImageCount = onlyValidValues[j][currentImageId];
      if (currentImageCount > totalCombinations[currentImageId]) {
        additionalDuplicates = additionalDuplicates + currentImageCount - totalCombinations[currentImageId];
      }
    }
  }

  console.log(additionalDuplicates);

  return allTotalCombinations.length - additionalDuplicates;
}

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
      typingLayerTimeout: 0,
      previewImage: "",
      showPreview: false,
      uniquecount: 0,
      layersXY: [],
      generateCount: 0
    };
  }

  componentDidMount() {
    this.retrieveLayers();
    this.viewLayerImages({ id: 1, name: "background" });
  }

  //Retrieve all unique layers in the database
  retrieveLayers = async () => {
    var count = await db.layerNames.orderBy("layer").count();
    //console.log(count);

    if (count === 0) {
      await db.layerNames.add({
        layer: "background",
        index: 0,
        rarity: 100,
      });
      this.layerName.push({
        name: "background",
        layerid: 1,
        index: 0,
        rarity: 100,
      });
    } else {
      this.layerName.length = 0;
      await db.layerNames
        .orderBy("index")
        .toArray()
        .then((theList) => {
          theList.forEach((item) => {
            //console.log(item.id);
            this.layerName.push({
              name: item.layer,
              layerid: item.id,
              index: item.index,
              rarity: item.rarity,
              xOffset: 0,
              yOffset: 0,
            });
          });
        });
    }
    this.setState({ layer: this.layerName }, () => {
      console.log(this.state.layer);
      this.getPreviewData(this.state.layer);
    });

  };

  handleLayerRarityChange = async (event) => {
    event.preventDefault();
    let objIndex = this.layerName.findIndex(
      (obj) => obj.layerid === parseInt(event.target.id)
    );
    this.layerName[objIndex].rarity = parseFloat(event.target.value);

    if (this.state.slidingLayerTimeout) {
      clearTimeout(this.state.slidingLayerTimeout);
    }

    this.setState({
      layer: this.layerName,
      slidingLayerTimeout: setTimeout(function () {
        console.log("Uploaded rarity changes to db");
        console.log(event.target.value);
        db.layerNames.update(parseInt(event.target.id), {
          rarity: parseFloat(event.target.value),
        });
      }, 500),
    });
  };

  // Updates **images database of new rarity adjusted by the range slider
  handleRarityChange = async (event) => {
    event.preventDefault();
    //Finds image in this.imageData and changes the rarity value according to the slider value
    let objIndex = this.imageData.findIndex(
      (obj) => obj.imageID === parseInt(event.target.id)
    );
    this.imageData[objIndex].rarity = parseFloat(event.target.value);

    //fancy js method of adding up values in array XD
    var totalRarity = this.imageData.reduce(
      (a, b) => a + parseFloat(b["rarity"] || 0),
      0
    );

    //Re-computing the rarity percentage for each image
    this.imageData.forEach((image) => {
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
        db.layers.update(parseInt(event.target.id), {
          rarity: parseFloat(event.target.value),
        });
      }, 500),
    });
  };

  // Computes total rarity value
  computeImageRarity = async (layer) => {
    var totalRarity = 0;

    await db.layers
      .where("layerid")
      .equals(layer.id)
      .toArray()
      .then((theList) => {
        theList.forEach((item) => {
          if (item.image !== undefined) {
            totalRarity = totalRarity + item.rarity;
          }
        });
      });
    return totalRarity;
  };

  // Querying database (Select * From LayersDB Where layerID = xxxxxx)
  queryDatabase = async (layerid) => {
    this.imageData.length = 0;
    const allLayers = await db.layers
      .where("layerid")
      .equals(layerid)
      .toArray();

    return allLayers;
  };

  // View images inside layers
  viewLayerImages = async (layer) => {
    var count = await db.layers.where("layerid").equals(layer.id).count();
    this.setState(
      {
        currentLayer: layer.name,
        currentLayerId: layer.id,
      },
      () => {
        // console.log("image state", this.state.image);
        //console.log("Current Layer", this.state.currentLayer);
      }
    );

    this.imageData.length = 0;

    //Check if layer has images
    if (count !== 0) {
      var totalRarity = await this.computeImageRarity(layer);
      await this.queryDatabase(layer.id).then((theList) => {
        theList.forEach((item) => {
          if (item.image !== undefined) {
            const imgBlob = URL.createObjectURL(item.image);
            // compute rarity percentage
            var rarity = (item.rarity / totalRarity) * 100;
            rarity = Math.round(rarity * 100) / 100;
            this.imageData.push({
              imageID: item.id,
              name: item.name,
              blob: imgBlob,
              rarity: item.rarity,
              rarityPercent: rarity,
            });
          }
        });
      });
    }

    this.setState({ image: this.imageData }, () => {
      // console.log("image state", this.state.image);
      //console.log("Current Layer", this.state.currentLayer);
    });
  };

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
        rarity: 50,
      });
    }
    this.setState({ file: this.blobData }, () => {
      this.viewLayerImages({
        name: this.state.currentLayer,
        id: this.state.currentLayerId,
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
    }
  };

  handleBrowseFiles = (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (this.validateFileExtension(files)) {
      console.log("allowed");
      this.addToDatabase(files);
    } else {
      console.log("not allowed");
    }
  };

  validateFileExtension = (files) => {
    var allowedTypes = ["jpg", "jpeg", "bmp", "gif", "png", "PNG"];
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      if (
        allowedTypes.includes(files[fileIndex].name.split(".").pop()) === false
      ) {
        return false;
      }
    }
    return true;
  };

  handleLayerNameChange = (event) => {
    event.preventDefault();
    var id = parseInt(this.state.currentLayerId);
    let objIndex = this.layerName.findIndex((obj) => obj.layerid === id);
    this.layerName[objIndex].name = event.target.value;

    if (this.state.typingLayerTimeout) {
      clearTimeout(this.state.typingLayerTimeout);
    }

    this.setState({
      currentLayer: event.target.value,
      typingLayerTimeout: setTimeout(async function () {
        // Update layers database
        await new GenerateComponent().queryDatabase(id).then((theList) => {
          theList.forEach((item) => {
            if (item.layerid === id) {
              db.layers.update(item.layerid, { layer: event.target.value });
            }
          });
        });
        // Update layerNames database
        await db.layerNames.update(id, { layer: event.target.value });
      }, 100),
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
      layer: "-",
      index: count,
      rarity: 100,
    });

    this.retrieveLayers();
  };

  // Deletes selected image
  deleteSingleImage = async (imageID) => {
    await db.layers.where("id").equals(imageID).delete();
    await this.viewLayerImages({
      id: this.state.currentLayerId,
      name: this.state.currentLayer,
    });
  };

  // For layerdnd.jsx to call
  handleToUpdate = async () => {
    //this.setState({layer: args});
    await this.retrieveLayers();
  };

  //Preview Images
  getPreviewData = async (layers) => {
    var img = undefined;
    var files = [];
    console.log("State Layers", layers);

    await db.layers
      .orderBy("rarity")
      .reverse()
      .toArray()
      .then(theList => {
        console.log("list", theList);
        for (let i = 0; i < Object.keys(this.state.layer).length; i++) {
          var BreakException = {};
          try {
            theList.forEach((image) => {
              if (layers[i].layerid === image.layerid) {
                files.push({ id: image.layerid, image: URL.createObjectURL(image.image) });
                throw BreakException;
              }
            });
          } catch (e) {
            if (e !== BreakException) throw e;
          }
        }
      });

    console.log("files", files);

    img = await MergeImages({
      images: files,
      height: 100,
      width: 100,
      layers: layers
    });
    console.log("Merged Preview", img);

    this.setState({
      imagePreview: img
    }, () => {
      console.log(this.state.imagePreview);
    });
  }

  //Upon clicking generate images, shows the generating modal
  handleShow = async () => {
    const files = await this.getAllData();
    const uniqueCount = await getUniqueCount({ files: files, layers: this.state.layer });

    this.setState({
      showPreview: true,
      uniqueCount: uniqueCount
    });
  }

  //Closes generating modal
  handleClose = () => {
    this.setState({ showPreview: false });
  }

  //Generate
  onClickGenerate = async () => {
    const files = await this.getAllData();
    const images = await GetMergedImages({ files: files, layers: this.state.layer, count: this.state.generateCount });
    window.location.assign("/collection");
  }

  changeInputState = () => {
    this.layerNameInput.focus();
  }

  getAllData = async () => {
    var files = new Object();
    await db.layerNames
      .orderBy("index")
      .toArray()
      .then(theList => {
        theList.forEach(item => {
          files[item.index] = new Object();
          files[item.index].layerId = item.id;
          files[item.index].layerName = item.layer;
          files[item.index].layerRarity = item.rarity;
          files[item.index].totalRarity = 0;
          files[item.index].layerImages = new Object();
        });
      });

    await db.layers
      .orderBy("rarity")
      .reverse()
      .toArray()
      .then(theList => {
        //console.log("list", theList);
        theList.forEach((image, index) => {
          for (let i = 0; i < Object.keys(files).length; i++) {
            if (files[i].layerId === image.layerid) {
              Object.assign(files[i], { totalRarity: files[i].totalRarity + image.rarity });
              files[i]["layerImages"][index] = new Object();
              Object.assign(files[i]["layerImages"][index], { imageId: image.id });
              Object.assign(files[i]["layerImages"][index], { layerId: image.layerid });
              Object.assign(files[i]["layerImages"][index], { imageName: image.name });
              Object.assign(files[i]["layerImages"][index], { imageRarity: image.rarity });
              Object.assign(files[i]["layerImages"][index], { imageData: URL.createObjectURL(image.image) });
            }
          }
        });
      });

    return files;
  }

  //Offest X and Y
  handleXY = (value,id) => {
    var newLayers = this.state.layer;
    for (let i =0; i < Object.keys(newLayers).length; i++) {
      const layerId = parseInt(id.slice(0,-1));
      const xOrY = id.substring(id.length -1);

      if (newLayers[i].layerid == layerId) {
        if (xOrY === "x") {
          newLayers[i].xOffset = parseInt(value);
        } else {
          newLayers[i].yOffset = parseInt(value);
        }
      }
    }

    this.setState({layer: newLayers}, () => {
      this.getPreviewData(this.state.layer);
    });
  }

  //Handle generateCount
  handleGenerateCount = (value) => {
    this.setState({generateCount: value});
  }

  render() {
    return (
      <>
        {/* Layer card */}
        <Grid
          h="90vh"
          templateRows="repeat(12, 1fr)"
          templateColumns="repeat(12, 1fr)"
          gap={6}
          pt={5}
        >
          <GridItem rowSpan={6} colSpan={4} bg="#292929" p={5} borderRadius="7">
            <Text fontWeight="bold" pb={3} color="#FBFBFB">
              Layers
            </Text>
            <Scrollbar
              plugins={{
                overscroll: {
                  effect: "bounce",
                },
              }}
            >
              <Box overflow="auto" height="70%">
                <div className={imageStyle.layerDiv}>
                  <span
                    className={imageStyle.layerButton}
                    onClick={() =>
                      this.viewLayerImages({ id: 1, name: "background" })
                    }
                  >
                    background
                  </span>
                </div>
                <SortableComponent
                  layerName={this.layerName.slice(1)}
                  handleToUpdate={this.handleToUpdate}
                  viewLayerImages={this.viewLayerImages}
                  handleShow={this.handleShow}
                  retrieveLayers={this.retrieveLayers}
                />
              </Box>
            </Scrollbar>
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

          {/* Upload Images Header */}
          <GridItem rowSpan={1} colSpan={8} pt={4}>
            <Text color="#F7F7F7" fontSize={23} fontWeight="bold">
              Upload Images
            </Text>
          </GridItem>

          {/* Drag drop card */}
          <GridItem
            rowSpan={5}
            colSpan={8}
            bg="#373737"
            borderRadius="15"
            overflow="auto"
          >
            <Box
              onDrop={this.handleDropEvent}
              onDragOver={(event) => {
                event.preventDefault();
              }}
              h="100%"
            >
              {Object.keys(this.state.image).length !== 0 ?
                <SimpleGrid
                  columns={4}
                  spacingX="40px"
                  spacingY="20px"
                  p="20px 40px"
                  onClick={() => console.log("LOL")}
                >
                  {(this.state.image || []).map((data, i) => (
                    <Box
                      h="120px"
                      w="120px"
                      m="auto"
                      bg="#595A5A"
                      borderRadius="10"
                      textAlign="center"
                      position="relative"
                      alignContent="center"
                    >
                      <Img
                        src={data.blob}
                        maxHeight="75%"
                        maxWidth="75%"
                        minHeight="90px"
                        minWidth="90px"
                        ml="15px"
                        p={3}
                      />
                      <XCircleIcon
                        className="remove_image"
                        onClick={(e) => this.deleteSingleImage(data.imageID)}
                      ></XCircleIcon>
                      <Text
                        layerStyle="card_content"
                        textAlign="center"
                        color="#FBFBFB"
                        fontWeight="450"
                        pl="7px"
                        pr="7px"
                      >
                        {data.name}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid> :

                <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                  <Box textAlign="center">
                    <Icon as={UploadIcon} w={75} h={75} color="gray.200"></Icon>
                    <Text color="#FBFBFB">Drop your images here!</Text>
                    <Text color="#FBFBFB">(image/png, Max size: 10mb)</Text>
                  </Box>
                </Box>
              }
            </Box>
          </GridItem>

          {/* Image Rarity card */}
          <GridItem
            rowSpan={6}
            colSpan={4}
            bg="#292929"
            p={5}
            overflow="auto"
            borderRadius="7"
          >
            <Box d="inline-block">
              <Text fontWeight="bold" pb={3} color="#FBFBFB" float="left">
                Image Rarity - {"\u00A0"}
              </Text>
              <Input fontWeight="bold" variant="unstyled" color="#FED428" w="40%" ref={x => this.layerNameInput = x}
                value={this.state.currentLayer}
                onChange={this.handleLayerNameChange}
              />
              <Icon as={PencilAltIcon} h={6} w={6} color="gray.200" cursor="pointer" verticalAlign="top" onClick={this.changeInputState} />
            </Box>

            {Object.keys(this.state.image).length !== 0 ? (
              (this.state.image || []).map((data, i) => (
                <SimpleGrid
                  columns={3}
                  spacing={3}
                  ml="20px"
                  pb="20px"
                  alignItems="center"
                >

                  <Box color="#FBFBFB" key={i}>
                    <span>{data.name}</span>
                  </Box>
                  <Box>
                    <input
                      id={data.imageID}
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={data.rarity}
                      class={imageStyle.raritySlider}
                      onChange={this.handleRarityChange}
                    ></input>{" "}
                    {""}
                  </Box>
                  <Box
                    display="block"
                    color="#FBFBFB"
                    textAlign="center"
                    ml="30px"
                    bg="#373737"
                    pt="10px"
                    pb="10px"
                    borderRadius="7px"
                  >
                    <Box as="span" fontSize={14}>
                      {data.rarityPercent}%
                    </Box>
                  </Box>
                </SimpleGrid>
              ))
            ) : (
              <Box>
                {" "}
                <Text color="#FBFBFB">* Upload images to start *</Text>
              </Box>
            )}
          </GridItem>

          {/* Preview card */}
          <GridItem rowSpan={6} colSpan={4} bg="#373737" borderRadius="15">
            <Box h='87%' display="flex" justifyContent="center" alignItems="center">
              <Box bg="#595A5A" h="80%" w="80%" borderRadius="15" display="flex" justifyContent="center" alignItems="center">
                <Img
                  id="previewNFT"
                  src={this.state.imagePreview}
                  maxHeight="75%"
                  maxWidth="75%"
                  minHeight="50%"
                  minWidth="50%"
                />
              </Box>
            </Box>
            <Box height='13%'>
              <Text color="#F7F7F7" fontSize={23} fontWeight="550" pl={5}>Preview</Text>
            </Box>
          </GridItem>

          {/* Project Name and Description card */}
          <GridItem rowSpan={6} colSpan={4}>
            <Box h="100%">
              <Box h="85%" overflow="auto">
                <Text color="#F7F7F7" fontSize={23} fontWeight="550">Project Name</Text>
                <Input color="#BFBFBF" variant="flushed" mb="20px" focusBorderColor="yellow.500" placeholder="Title"></Input>
                <Text color="#F7F7F7" fontSize={23} fontWeight="550">Description</Text>
                <Textarea color="#BFBFBF" variant="flushed" mb="20px" focusBorderColor="yellow.500" minHeight="39%" maxHeight="39%" maxLength="250" placeholder="What is your collection about? (250 characters max)"></Textarea>
              </Box>
              <Box h="15%">
                <Button onClick={this.handleShow} colorScheme="yellow" float="right">Generate Images</Button>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        <Modal show={this.state.showPreview} onHide={this.handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <img id="previewNFT" src={this.state.imagePreview}  style={{display: "block", marginLeft:"auto", marginRight:"auto"}} />
              <Container>
              {
                  this.state.layer.map((layer,i) =>{
                      return (
                          <Row style={{marginTop:"10px"}}>
                            <Col xs={6} md={4}>
                              <FormLabel>{layer.name}</FormLabel>
                            </Col>
                            <Col xs={3} md={4}>
                              <NumberInput defaultValue={layer.xOffset} id={layer.layerid + "x"} onChange={ e => this.handleXY(e, layer.layerid + "x")}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Col>
                            <Col xs={3} md={4}>
                              <NumberInput defaultValue={layer.yOffset} id={layer.layerid + "y"} onChange={ e => this.handleXY(e, layer.layerid + "y")}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Col>
                          </Row>
                      )
                  })
              }
              </Container>
              <FormControl>
                <FormLabel>You can generate up to {this.state.uniqueCount} unique images</FormLabel>
                <NumberInput onChange={this.handleGenerateCount} defaultValue={this.state.generateCount} max={this.state.uniqueCount} min={0}>
                  <NumberInputField/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.onClickGenerate} variant="dark">
              Generate
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default GenerateComponent;

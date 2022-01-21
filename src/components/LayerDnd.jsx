import React, { Component } from "react";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import db from '../db.js';
import imageStyle from "./TestImage.module.css";
import { Button, Modal } from "react-bootstrap";

const SortableItem = SortableElement(({ value }) => (
    <div className={imageStyle.layerDiv}>
        <span className={imageStyle.layerButton} id="display" data-id={value.id} data-name={value.name} tabIndex={0}>{value.name}</span>
        <span id="delete" data-id={value.id} data-name={value.name} className={imageStyle.layerDelete}>x</span>
    </div>
));

const SortableList = SortableContainer(({ items }) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={{ id: value.layerid, name: value.name }} />
            ))}
        </ul>
    );
});

class SortableComponent extends Component {
    layerNamesArray = []
    layerIdArray = []
    constructor(props) {
        super(props);
        this.state = {
            items: this.layerNamesArray,
            id: this.layerIdArray,
            currentLayer: null,
            currentLayerId: null,
            showConfirmation: false,
            setShowConfirmation: false
        };
    }

    shouldComponentUpdate(nextProps) {
        return (this.props.layerName !== nextProps.layerName);
    }

    onSortEnd = async ({ oldIndex, newIndex }) => {
        //console.log("hi");
        this.layerNamesArray.length = 0;
        this.layerIdArray.length = 0;

        this.props.layerName.map((value, index) => (
            this.layerNamesArray.push(value.name),
            this.layerIdArray.push(value.layerid)
        ));

        this.layerNamesArray = arrayMoveImmutable(this.layerNamesArray, oldIndex, newIndex)
        this.layerIdArray = arrayMoveImmutable(this.layerIdArray, oldIndex, newIndex)
        console.log("before", this.state.items)
        console.log("beforeID", this.state.id)

        this.setState({
            items: this.layerNamesArray,
            id: this.layerIdArray
        }, async () => {
            console.log("after", this.state.items);
            console.log("afterID", this.state.id);
            console.log("tews", this.layerIdArray);
            this.layerIdArray.unshift(1);
            console.log("afterUnshift", this.layerIdArray)

            // Updating the layers indexes in the db
            for (let i = 0; i < (Object.keys(this.layerIdArray).length); i++) {
                var layerIndex = this.layerIdArray.map(function (x) { return x; }).indexOf(this.layerIdArray[i]);
                await db.layerNames.update(parseInt(this.layerIdArray[i]), { index: parseInt(layerIndex) });
            };

            await this.props.retrieveLayers();
        });
    }

    shouldCancelStart = (e) => {
        var targetEle = e;
        if (!targetEle.id) {
            targetEle = e.target;
        };
        // On click operation here
        if (targetEle.id === 'display') {
            this.props.viewLayerImages({ id: parseInt(e.target.dataset.id), name: e.target.dataset.name });
        };

        if (targetEle.id === 'delete') {
            this.handleShow({ id: parseInt(e.target.dataset.id), name: e.target.dataset.name });
        };
    }

    handleSelectedLayer = (layer) => {
        this.setState({
            currentLayer: layer.name,
            currentLayerId: layer.id
        });
    }

    // Deletes all the images in the layer
    deleteAllLayerImage = async (layer) => {
        await db.layers.where("layerid").equals(layer.id).delete();
        await this.props.retrieveLayers();
        await this.props.viewLayerImages(layer);
        // console.log("FWEIFMWEIFMWEIFM")
    }


    // Deletes the layer and all the images in the layer
    deleteLayerButton = async (layer) => {
        // DeleteConfirmation();
        var id = parseInt(layer.id);
        console.log(layer);
        await db.layerNames.where("id").equals(id).delete();
        this.deleteAllLayerImage({ id: id, name: layer.name });
        this.handleClose();
    }

    // Confirmation Modal
    handleClose = () => {
        this.setState({
            showConfirmation: false,
            setShowConfirmation: false
        });
    }

    // Confirmation Modal
    handleShow = (layer) => {
        this.setState({
            showConfirmation: true,
            setShowConfirmation: true,
            currentLayer: layer.name,
            currentLayerId: layer.id
        });
    }

    render() {
        return (
            <div>
                {/* {Object.keys(this.props.layerName).length !== 0 && */}
                <SortableList
                    items={this.props.layerName}
                    onSortEnd={this.onSortEnd}
                    onSortStart={(_, event) => event.preventDefault()}
                    shouldCancelStart={this.shouldCancelStart}
                />
                {/* } */}

                {/* Modal for delete confirmation */}
                <Modal show={this.state.showConfirmation} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Removing this layer will remove all images in this layer.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.deleteLayerButton({ id: this.state.currentLayerId, name: this.state.currentLayer })}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default SortableComponent;
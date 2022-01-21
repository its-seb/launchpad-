import React from "react";
import Dexie from 'dexie';

// export const db = new Dexie('myDatabase');
// db.version(1).stores({
//     layers: '++id, name, image, rarity',
// });


// async function downloadAndStoreImage(props) {
//     const res = await fetch("some-url-to-an-image.png");
//     const blob = await res.blob();
//     // Store the binary data in indexedDB:
//     await db.layers.put({
//         name: "David",
//         image: blob
//     });
// }

class ImageFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "someUniqueId", // I would use this.props.id for a real world implementation
            imageURI: null,
            images: []
        }
    };

    //throw images into db one by one XD
    //read from db and display (?)

    blobToData(blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result;
            if (base64data !== undefined) {
                return base64data
            }
        };
    };

    dataToBlob() {

    }

    buildImgTag() {
        let imgTag = null;
        if (this.state.imageURI !== null) {
            console.log(this.state.imageURI);
            var dataURI = this.state.imageURI
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);

            // create a view into the buffer
            var ia = new Uint8Array(ab);

            // set the bytes of the buffer to the correct values
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var blob = new Blob([ab], { type: mimeString });

            //console.log(blob);
            //console.log("test");

            if (blob.type.split("/")[1] !== "png") {
                // alert("cannot");
                //console.log("cannot")
            } else {
                console.log(this.blobToData(blob));
            }

            imgTag = (<div className="row">
                <div className="small-9 small-centered columns">
                    <img className="thumbnail" src={this.state.imageURI} alt=""></img>
                </div>
            </div>);
        }
        return imgTag;
    }

    readURI(e) {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = function (ev) {
                this.setState({ imageURI: ev.target.result });
            }.bind(this);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleChange(e) {
        this.readURI(e); // maybe call this with webworker or async library?
        console.log("LOL")
        console.log(e.target.files);
        if (this.props.onChange !== undefined) {
            this.props.onChange(e); // propagate to parent component
        }
    }

    render() {
        const imgTag = this.buildImgTag();

        return <div>
            <label
                htmlFor={this.state.id}
                className="button">
                Upload an image
            </label>
            <input
                id={this.state.id}
                type="file"
                onChange={this.handleChange.bind(this)}
                className="show-for-sr"
                accept="image/png" multiple />
            {imgTag}
        </div>;
    }
}

export default ImageFile;
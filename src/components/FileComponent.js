import React, { Component } from "react";

export class FileComponent extends Component {
  componentDidMount() {
    document.getElementById("_pageTitle").innerText = this.props.pageTitle;
  }

  render() {
    return <div>file component</div>;
  }
}

export default FileComponent;

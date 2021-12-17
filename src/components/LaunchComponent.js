import React, { Component } from "react";

export class LaunchComponent extends Component {
  componentDidMount() {
    document.getElementById("_pageTitle").innerText = this.props.pageTitle;
  }

  render() {
    return <div>launch component</div>;
  }
}

export default LaunchComponent;

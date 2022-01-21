import React, { Component } from "react";
import "./style.css";

export class FailureComponent extends Component {
  render() {
    return (
      <div
        className="w4rAnimated_checkmark load-fail"
        style={{ display: "none" }}
        id={this.props.id}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 130.2 130.2"
        >
          <circle
            className="path circle"
            fill="none"
            stroke="#cd0e00"
            strokeWidth="6"
            strokeMiterlimit="10"
            cx="65.1"
            cy="65.1"
            r="62.1"
          />
          <line
            className="path line"
            fill="none"
            stroke="#cd0e00"
            strokeWidth="6"
            strokeLinecap="round"
            strokeMiterlimit="10"
            x1="34.4"
            y1="37.9"
            x2="95.8"
            y2="92.3"
          />
          <line
            className="path line"
            fill="none"
            stroke="#cd0e00"
            strokeWidth="6"
            strokeLinecap="round"
            strokeMiterlimit="10"
            x1="95.8"
            y1="38"
            x2="34.4"
            y2="92.2"
          />
        </svg>
      </div>
    );
  }
}

export default FailureComponent;

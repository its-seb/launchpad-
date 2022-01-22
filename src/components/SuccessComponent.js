import React, { Component } from "react";
import "./style.css";
import { Box } from "@chakra-ui/react";

export class SuccessComponent extends Component {
  render() {
    return (
      <Box
        ref={this.props._ref}
        className="w4rAnimated_checkmark load-success"
        display={this.props._show}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 130.2 130.2"
        >
          <circle
            className="path circle"
            fill="none"
            stroke="#5cb85c"
            strokeWidth="6"
            strokeMiterlimit="10"
            cx="65.1"
            cy="65.1"
            r="62.1"
          />
          <polyline
            className="path check"
            fill="none"
            stroke="#5cb85c"
            strokeWidth="6"
            strokeLinecap="round"
            strokeMiterlimit="10"
            points="100.2,40.2 51.5,88.8 29.8,67.5 "
          />
        </svg>
      </Box>
    );
  }
}

export default SuccessComponent;

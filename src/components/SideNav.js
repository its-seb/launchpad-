import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import "./style.css";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { NavLink } from "react-router-dom";

function SideNav() {
  return (
    <>
      <Nav className="flex-column sideBar">
        <NavLink className="logo" to="/">
          launchpad
        </NavLink>
        <NavLink className="navPill unselectable" to="/">
          collections
          <ArrowRightIcon className="pillArrow"></ArrowRightIcon>
        </NavLink>
        <NavLink className="navPill unselectable" to="/files">
          files
          <ArrowRightIcon className="pillArrow"></ArrowRightIcon>
        </NavLink>
        <NavLink className="navPill unselectable" to="/launch">
          launch
          <ArrowRightIcon className="pillArrow"></ArrowRightIcon>
        </NavLink>
      </Nav>
    </>
  );
}

export default SideNav;

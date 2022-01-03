import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/style.css";
import SideNav from "./components/SideNav.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dexie from "dexie";
import CollectionComponent from "./components/CollectionComponent.js";
import FileComponent from "./components/FileComponent.js";
import LaunchComponent from "./components/LaunchComponent.js";
import Usergallery from "./components/Usergallery";
import { Button } from "react-bootstrap";
import ICONexConnection from "./components/utils/interact.js";
import LandingComponent from "./components/LandingComponent";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact element={<LandingComponent />} path="/"></Route>
        </Routes>
      </Router>
    );
  }
}

export default App;

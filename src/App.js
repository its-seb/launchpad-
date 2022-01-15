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
import ICONexConnection from "./components/utils/interact.js";
import LandingComponent from "./components/LandingComponent";
import NavigationComponent from "./components/NavigationComponent";
import GenerateComponent from "./components/GenerateComponent";
import { Box, Stack, Link, Button } from "@chakra-ui/react";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Router>
          <Routes>
            <Route exact element={<LandingComponent />} path="/"></Route>
          </Routes>
          <NavigationComponent></NavigationComponent>
          <Box
            h={["100%", "100%", "calc(100vh - 70px)", "calc(100vh - 70px)"]}
            bg={"#202225"}
          >
            <Box mx="auto" maxW="1300px" px={"5"}>
              <Routes>
                <Route
                  exact
                  element={<CollectionComponent />}
                  path="/collection"
                ></Route>
                <Route exact element={<FileComponent />} path="/file"></Route>
                <Route
                  exact
                  element={<LaunchComponent />}
                  path="/launch"
                ></Route>
                <Route
                  exact
                  element={<GenerateComponent />}
                  path="/generate"
                ></Route>
              </Routes>
            </Box>
          </Box>
        </Router>
      </>
    );
  }
}

export default App;

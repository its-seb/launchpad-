import React, { Component } from "react";
import "./App.css";
import AppContent from "./components/AppContent.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <AppContent />
      </div>
    );
  }
}

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./Components/MainPage";

function App() {
  return (
      <Router>
          <Switch>
              <Route exact path="/" component={MainPage} />
          </Switch>
      </Router>
  );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./Components/MainPage";
import ChatPage from "./Components/ChatPage";

function App() {
  return (
      <Router>
          <Switch>
              <Route exact path="/" component={MainPage} />
              <Route path="/chats/:id">
                  <ChatPage />
              </Route>
          </Switch>
      </Router>
  );
}

export default App;
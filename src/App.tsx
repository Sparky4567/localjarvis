import "bootstrap/dist/css/bootstrap.min.css";
import "fontawesome-4.7/css/font-awesome.min.css";
import "./App.css";

import { Component } from "react";
import ChatBox from "./components/chatbox/ChatBox";

class App extends Component {
  constructor(props: object) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row min-vh-100 align-items-center text-center">
          <ChatBox />
        </div>
      </div>
    );
  }
}

export default App;

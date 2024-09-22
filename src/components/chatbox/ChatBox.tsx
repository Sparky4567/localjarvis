import { Component } from "react";
import ollama from "ollama/browser";
import Dictaphone from "../dictaphone/Dictaphone";

class ChatBox extends Component {
  boxStyle: { color: string; fontSize: string };
  settings: { chatboxText: string };
  chatStyle: { color: string; fontSize: string };
  state: {
    models: string | null;
    storedAnswers: string | null;
    questions: string | null;
    availableModels: [] | null;
    selectedModel: string | null;
  };
  constructor(props: object) {
    super(props);
    this.boxStyle = {
      color: "white",
      fontSize: "2rem",
    };
    this.chatStyle = {
      color: "white",
      fontSize: "1.4rem",
    };
    this.settings = {
      chatboxText: "ChatBox",
    };
    this.state = {
      models: null,
      storedAnswers: null,
      questions: null,
      availableModels: null,
      selectedModel: null,
    };
    this.chatStyle = {
      color: "white",
      fontSize: "1.4rem",
    };
    this.questionChange = this.questionChange.bind(this);
    // this.ollamaAnswer = this.ollamaAnswer.bind(this);
  }

  questionChange(passedValue: string) {
    this.setState({ questions: passedValue });
  }

  modelChange(passedValue: string) {
    this.setState({ selectedModel: passedValue });
  }

  async ollamaAnswer(passedString: string) {
    const message = { role: "user", content: passedString };
    const response = await ollama.chat({
      model: String(this.state.selectedModel),
      messages: [message],
      stream: true,
    });
    const chatSel = document.querySelector("#chatBox");
    for await (const part of response) {
      chatSel.value = chatSel.value + part.message.content;
    }
    chatSel.value = chatSel.value + "\n\n";
  }

  async listModels() {
    const modelsList = await ollama.list();
    return modelsList;
  }

  componentDidMount() {
    this.setState({ selectedModel: "tinyllama:latest" });
    this.listModels().then((data) => {
      this.setState({ availableModels: data.models });
    });
  }

  render() {
    return (
      <div
        style={this.boxStyle}
        className="col-lg-10 col-md-10 col-xs-12 col-sm-12 mx-auto my-4"
      >
        <div className="shadow p-3 mb-5 rounded bg-dark">
          {this.settings.chatboxText}
          {this.state.availableModels !== null ? (
            <select
              defaultValue={"tinyllama:latest"}
              className="form-control form-control-lg my-2"
              onChange={(e) => {
                // eslint-disable-next-line prefer-const
                let selected = e.currentTarget.selectedOptions[0].value;
                this.modelChange(selected);
              }}
            >
              {this.state.availableModels.map((mod, ind) => {
                return <option key={ind}>{mod.name}</option>;
              })}
            </select>
          ) : (
            ""
          )}
          <textarea
            id="chatBox"
            style={this.chatStyle}
            className="form-control form-control-lg bg-dark my-4"
            rows={10}
          ></textarea>
          <input
            id="questionField"
            style={this.chatStyle}
            className="form-control form-control-lg bg-dark my-4"
            type="text"
            placeholder="Enter your text here"
            onChange={(event) => {
              // eslint-disable-next-line prefer-const
              let value = event.currentTarget.value;
              const immutableValue = value;
              this.questionChange(immutableValue);
            }}
          ></input>
          {this.state.questions !== null && this.state.questions !== "" ? (
            <button
              onClick={() => {
                this.ollamaAnswer(this.state.questions);
              }}
              className="btn btn-light form-control form-control-lg"
            >
              Ask
            </button>
          ) : (
            ""
          )}
          <Dictaphone />
        </div>
      </div>
    );
  }
}

export default ChatBox;

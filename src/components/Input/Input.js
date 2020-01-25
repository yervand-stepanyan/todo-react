import React from "react";
import "./input.css";

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todoValue: "",
    };
  }

  static VARIABLES = {
    placeholder: "What needs to be done?"
  };

  componentDidMount() {
    this.todoInput.focus();
  }

  onInputChange = ({target: {value}}) => {
    this.setState({
      todoValue: value
    });
  };

  handleSubmit = () => {
    const valueFromInput = this.state.todoValue;
    const firstReplace = valueFromInput.replace(/\s\s+/g, ' ');
    const wsRegex = /^\s*|\s*$/g;
    const value = firstReplace.replace(wsRegex, '');

    if (value !== "") {
      this.props.onTodoAdd(value);
      this.setState({
        todoValue: ""
      });

      this.todoInput.focus();
    }
  };

  handleSubmitEnterKey = (event) => {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  };

  render() {
    const {todoValue} = this.state;

    return (
      <div className="inpDiv">
        <input
          ref={node => this.todoInput = node}
          className="input"
          placeholder={Input.VARIABLES.placeholder}
          value={todoValue}
          onChange={this.onInputChange}
          onKeyDown={this.handleSubmitEnterKey}
        />
        <button className="btnAdd" onClick={this.handleSubmit}>Add</button>
      </div>
    );
  }
}

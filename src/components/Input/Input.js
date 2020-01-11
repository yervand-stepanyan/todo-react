import React from "react";
import "./input.css";

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todoValue: "",
      placeholder: "Add Todo"
    };
  }

  onInputChange = ({target: {value}}) => {
    console.groupCollapsed("ON_INPUT_CHANGE");
    console.log(`value: ${value}`);
    console.groupEnd();
    this.setState({
      todoValue: value
    });
  };

  handleSubmit = () => {
    if (this.state.todoValue !== "") {
      this.props.onTodoAdd(this.state.todoValue);
      this.setState({
        todoValue: ""
      });
    }
  };

  handleSubmitEnterKey = (event) => {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  };

  render() {
    const {placeholder, todoValue} = this.state;

    return (
      <div className="inpDiv">
        <input
          placeholder={placeholder}
          value={todoValue}
          onChange={this.onInputChange}
          onKeyDown={this.handleSubmitEnterKey}
        />
        <button className="btnAdd" onClick={this.handleSubmit}>Add</button>
      </div>
    );
  }
}

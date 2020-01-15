import React from "react";
import "./input.css";

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todoValue: "",
      placeholder: "What needs to be done?"
    };
  }

  componentDidMount() {
    this.todoInput.focus();
  }

  onInputChange = ({target: {value}}) => {
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

      this.todoInput.focus();
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
          ref={node => this.todoInput = node}
          className="input"
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

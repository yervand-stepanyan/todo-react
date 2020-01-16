import React from "react";
import Input from "../Input/Input";
import "./todo.css";
import FilteringOptions from "../FilteringOptions/FilteringOptions";

const FILTER_STATES = {
  all: "all",
  active: "active",
  completed: "completed"
};

export default class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      currentId: 1,
      filter: FILTER_STATES.all,
      isSelectAllClicked: false,
      clickCount: 0,
      checkbox: false,
    };
  }

  onTodoAdd = todoValue => {
    this.setState(state => ({
      todos: [
        ...state.todos,
        {id: state.currentId, name: todoValue, isComplete: false, isEdit: false}
      ],
      currentId: state.currentId + 1
    }));
  };

  onTodoSelect = activeId => {
    this.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === activeId
          ? {...todo, isComplete: !todo.isComplete, isEdit: false}
          : todo
      )
    }));
  };

  onSelectAll = () => {
    this.setState({isSelectAllClicked: !this.state.isSelectAllClicked}, () =>
      this.setState(state => ({
        todos: state.todos.map(todo =>
          ({...todo, isComplete: this.state.isSelectAllClicked, isEdit: false}))
      }))
    );
  };

  onCheckboxChange = (e, activeId) => {
    this.onTodoSelect(activeId);
  };

  onTextClick = activeId => {
    this.setState(state => ({
      clickCount: state.clickCount + 1
    }), () => {

      if (this.state.clickCount === 1) {
        this.singleClickTimer = setTimeout(() => {
          this.setState({clickCount: 0});
          this.onTodoSelect(activeId);
        }, 400);
      } else if (this.state.clickCount === 2) {
        clearTimeout(this.singleClickTimer);
        this.setState({clickCount: 0});
        this.onTodoEdit(activeId);
      }

    });
  };

  onTodoEdit = activeId => {
    this.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === activeId ? {...todo, isEdit: true} : todo
      )
    }));

    setTimeout(() => {
      this.editInp.focus();
    });
  };

  onItemInputChange = (id, event) => {
    const {value} = event.target;

    this.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === id ? {...todo, name: value} : todo
      )
    }));
  };

  onItemKeyPress = (id, e) => {
    const isEnter = e.key === "Enter";

    this.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === id
          ? {...todo, isEdit: isEnter ? false : todo.isEdit}
          : todo
      )
    }));
  };

  submitOnBlur = (id, e) => {
    e.preventDefault();

    this.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === id
          ? {...todo, isEdit: false}
          : todo
      )
    }));
  };

  onRemove = activeId => {
    console.log(this.state.todos);

    this.setState(state => ({
      todos: state.todos.filter(todo => todo.id !== activeId)
    }), () => {
      if (this.state.todos.length === 0) {
        this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
      }
    });
  };

  onFilter = filter => {
    this.setState({
      filter
    });
  };

  getFilteredTodos = (todos, filter) => {
    let normalizedTodos = todos;

    if (filter === FILTER_STATES.completed) {
      normalizedTodos = todos.filter(todo => todo.isComplete);
    } else if (filter === FILTER_STATES.active) {
      normalizedTodos = todos.filter(todo => !todo.isComplete);
    }

    return normalizedTodos;
  };

  filterItemsLeft = () => {
    const count = this.state.todos.filter(todo => !todo.isComplete).length;

    return count;
  };

  // onClearCompleted = () => {
  //   console.log(this.state.todos);
  //
  //   this.setState(state => ({
  //     todos: state.todos.map(todo => {
  //       if (!todo.isComplete)
  //         return {...todo};
  //     })
  //   }), () => console.log(this.state.todos));
  // };

  render() {
    const {todos, filter, isSelectAllClicked} = this.state;
    const normalizedTodos = this.getFilteredTodos(todos, filter);
    const isCompleted = todos.some(todo => todo.isComplete);

    return (
      <div className="main">
        <div className="contentSection">
          <div className="title">
            <h1>Todo</h1>
          </div>
          <div className="inputSection">
            <div className="inputDiv">
              <div className={todos.length > 0 ? "showSelectAll" : "hideSelectAll"}
                   title="Mark all completed">
                <i className="down" onClick={this.onSelectAll}></i>
              </div>
              <Input onTodoAdd={this.onTodoAdd}/>
            </div>
            <div className={todos.length > 0 ? "section" : "noDisplay"}>
              <section>
                <ul>
                  {normalizedTodos.map(({name, id, isComplete, isEdit}) => (
                    <li key={id}>
                      <div className="liContent">
                        <div className="checkBoxDiv">
                          <input type="checkbox" id={`chbox${id}`}
                                 onChange={e => this.onCheckboxChange(e, id)}
                                 checked={isComplete}
                                 className={!isEdit ? "css-checkbox" : "checkBoxNone"}/>
                          <label htmlFor={`chbox${id}`} className="css-label"></label>
                        </div>
                        {isEdit ? (
                          <input
                            ref={node => this.editInp = node}
                            className="editInput"
                            value={name}
                            onChange={e => this.onItemInputChange(id, e)}
                            onKeyDown={e => this.onItemKeyPress(id, e)}
                            onBlur={e => this.submitOnBlur(id, e)}
                          />
                        ) : (
                          <span className={isComplete ? "checked" : "unchecked"}
                                onClick={() => this.onTextClick(id)}>{name}</span>
                        )}
                        <button
                          className={!isEdit ? "removeItem" : "removeItemNone"}
                          onClick={() => this.onRemove(id)}
                        >&times;</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <div className={todos.length > 0 ? "filters" : "noDisplay"}>
              <FilteringOptions
                filter={filter}
                onFilter={this.onFilter}
                leftItems={this.filterItemsLeft()}
                onClearCompleted={this.onClearCompleted}
                isCompleted={isCompleted}/>
            </div>

          </div>
          <div className={todos.length > 0 ? "showFoldingEffect" : "hideFoldingEffect"}>
            <div className="footerDivLarge"></div>
            <div className="footerDivSmall"></div>
          </div>
        </div>
      </div>
    );
  }
}

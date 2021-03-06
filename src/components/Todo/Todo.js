import React from "react";

import FilteringOptions from "../FilteringOptions/FilteringOptions";
import Input from "../Input/Input";
import {loadState, removeState, saveState} from "../../helpers/localStorage";
import {LOCAL_STORAGE} from "../../globals/constants";
import "./todo.css";

const FILTER_STATES = {
  all: "all",
  active: "active",
  completed: "completed"
};

export default class Todo extends React.Component {
  constructor(props) {
    super(props);

    const todos = loadState(LOCAL_STORAGE.todos) || [];
    const currentId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    const filter = loadState(LOCAL_STORAGE.filter) || FILTER_STATES.all;
    const isSelectAllClicked = loadState(LOCAL_STORAGE.isSelectAllClicked) || false;

    this.state = {
      todos,
      currentId,
      filter,
      isSelectAllClicked,
      clickCount: 0,
      checkbox: false,
    };
  }

  onTodoAdd = todoValue => {
    this.setState(state => ({
        todos: [
          ...state.todos,
          {id: state.currentId, title: todoValue, isComplete: false, isEdit: false}
        ],
        currentId: state.currentId + 1,
      }), () => {
        saveState(LOCAL_STORAGE.todos, this.state.todos);
        saveState(LOCAL_STORAGE.isSelectAllClicked, this.state.isSelectAllClicked);
        saveState(LOCAL_STORAGE.filter, this.state.filter);
      }
    );
  };

  onTodoSelect = activeId => {
    this.setState(state => ({
        todos: state.todos.map(todo =>
          todo.id === activeId
            ? {...todo, isComplete: !todo.isComplete, isEdit: false}
            : todo
        )
      }), () => {
        this.setState({
            isSelectAllClicked: this.state.todos.every(todo => todo.isComplete)
          },
          () =>
            saveState(LOCAL_STORAGE.isSelectAllClicked, this.state.isSelectAllClicked)
        );

        saveState(LOCAL_STORAGE.todos, this.state.todos);
      }
    );
  };

  onSelectAll = () => {
    this.setState({isSelectAllClicked: !this.state.isSelectAllClicked}, () =>
      this.setState(state => ({
        todos: state.todos.map(todo =>
          ({...todo, isComplete: this.state.isSelectAllClicked, isEdit: false}))
      }), () => {
        saveState(LOCAL_STORAGE.todos, this.state.todos);
        saveState(LOCAL_STORAGE.isSelectAllClicked, this.state.isSelectAllClicked);
      })
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
      })
    );

    setTimeout(() => {
      this.editInp.focus();
    });
  };

  onItemInputChange = (id, event) => {
    const {value} = event.target;

    this.setState(state => ({
      todos: state.todos.map(todo =>
        todo.id === id ? {...todo, title: value} : todo
      )
    }));
  };

  onItemKeyPress = (id, e) => {
    const isEnter = e.key === "Enter";

    if (isEnter) {
      this.state.todos.forEach(todo => {
        if (todo.id === id) {
          if (todo.title) {
            const title = this.state.todos.filter(todo => todo.id === id)[0].title;
            const firstReplace = title.replace(/\s\s+/g, ' ');
            const wsRegex = /^\s*|\s*$/g;
            const value = firstReplace.replace(wsRegex, '');

            this.setState(state => ({
                todos: state.todos.map(todo =>
                  todo.id === id
                    ? {...todo, title: value, isEdit: isEnter ? false : todo.isEdit}
                    : todo
                )
              }), () => {
                saveState(LOCAL_STORAGE.todos, this.state.todos);

                if (this.state.todos.length === 0) {
                  this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
                  removeState(LOCAL_STORAGE.todos);
                  removeState(LOCAL_STORAGE.filter);
                  removeState(LOCAL_STORAGE.isSelectAllClicked);
                }
              }
            );
          } else {
            this.setState(state => ({
                todos: state.todos.filter(todo => todo.id !== id)
              }), () => {
                saveState(LOCAL_STORAGE.todos, this.state.todos);

                if (this.state.todos.length === 0) {
                  this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
                  removeState(LOCAL_STORAGE.todos);
                  removeState(LOCAL_STORAGE.filter);
                  removeState(LOCAL_STORAGE.isSelectAllClicked);
                }
              }
            );
          }
        }
      });
    }
  };

  submitOnBlur = (id, e) => {
    e.preventDefault();

    this.state.todos.forEach(todo => {
      if (todo.id === id) {
        if (todo.title) {
          const title = this.state.todos.filter(todo => todo.id === id)[0].title;
          const firstReplace = title.replace(/\s\s+/g, ' ');
          const wsRegex = /^\s*|\s*$/g;
          const value = firstReplace.replace(wsRegex, '');

          this.setState(state => ({
              todos: state.todos.map(todo =>
                todo.id === id
                  ? {...todo, title: value, isEdit: false}
                  : todo
              )
            }), () => {
              saveState(LOCAL_STORAGE.todos, this.state.todos);

              if (this.state.todos.length === 0) {
                this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
                removeState(LOCAL_STORAGE.todos);
                removeState(LOCAL_STORAGE.filter);
                removeState(LOCAL_STORAGE.isSelectAllClicked);
              }
            }
          );
        } else {
          this.setState(state => ({
              todos: state.todos.filter(todo => todo.id !== id)
            }), () => {
              saveState(LOCAL_STORAGE.todos, this.state.todos);

              if (this.state.todos.length === 0) {
                this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
                removeState(LOCAL_STORAGE.todos);
                removeState(LOCAL_STORAGE.filter);
                removeState(LOCAL_STORAGE.isSelectAllClicked);
              }
            }
          );
        }
      }
    });
  };

  onRemove = activeId => {
    this.setState(state => ({
      todos: state.todos.filter(todo => todo.id !== activeId)
    }), () => {
      saveState(LOCAL_STORAGE.todos, this.state.todos);

      if (this.state.todos.length === 0) {
        this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
        removeState(LOCAL_STORAGE.todos);
        removeState(LOCAL_STORAGE.filter);
        removeState(LOCAL_STORAGE.isSelectAllClicked);
      }
    });
  };

  onFilter = filter => {
    this.setState({
      filter
    }, () => saveState(LOCAL_STORAGE.filter, this.state.filter));
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
    return this.state.todos.filter(todo => !todo.isComplete).length;
  };

  onClearCompleted = () => {
    this.setState(state => ({
      todos: state.todos.filter(todo => !todo.isComplete)
    }), () => {
      saveState(LOCAL_STORAGE.todos, this.state.todos);

      if (this.state.todos.length === 0) {
        this.setState({filter: FILTER_STATES.all, isSelectAllClicked: false});
        removeState(LOCAL_STORAGE.todos);
        removeState(LOCAL_STORAGE.filter);
        removeState(LOCAL_STORAGE.isSelectAllClicked);
      }
    });
  };

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
              <div className={`${todos.length > 0 ? "showSelectAll" : "hideSelectAll"} 
              ${isSelectAllClicked ? "selectAllClicked" : ""}`}
                   title="Mark all completed" onClick={this.onSelectAll}>
                <i className="down" />
              </div>
              <Input onTodoAdd={this.onTodoAdd}/>
            </div>
            <div className={todos.length > 0 ? "section" : "noDisplay"}>
              <section>
                <ul>
                  {normalizedTodos.map(({title, id, isComplete, isEdit}) => (
                    <li key={id}>
                      <div className="liContent">
                        <div className="checkBoxDiv">
                          <input type="checkbox" id={`chbox${id}`}
                                 onChange={e => this.onCheckboxChange(e, id)}
                                 checked={isComplete}
                                 className={!isEdit ? "css-checkbox" : "checkBoxNone"}/>
                          <label htmlFor={`chbox${id}`} className="css-label" />
                        </div>
                        {isEdit ? (
                          <input
                            ref={node => this.editInp = node}
                            className="editInput"
                            value={title}
                            onChange={e => this.onItemInputChange(id, e)}
                            onKeyDown={e => this.onItemKeyPress(id, e)}
                            onBlur={e => this.submitOnBlur(id, e)}
                          />
                        ) : (
                          <span className={isComplete ? "checked" : "unchecked"}
                                onClick={() => this.onTextClick(id)}>{title}</span>
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
            <div className="footerDivLarge" />
            <div className="footerDivSmall" />
          </div>
        </div>
      </div>
    );
  }
}

import React from "react";
import "./filteringOptions.css";

const FILTER_STATES = {
  all: "all",
  active: "active",
  completed: "completed"
};

export default function FilteringOptions({filter, onFilter, leftItems}) {
  const itemsLeft = `${leftItems} ${leftItems === 1 ? "item left" : "items left"}`;
  const filterBtn=`${filter === FILTER_STATES.active ? "select" : ""} filterBtn`;

  return (
    <div className="mainFilter">
      <div className="leftItems">
        <span>{itemsLeft}</span>
      </div>
      <div className="filterButtons">
        <button
          className={filter === FILTER_STATES.all ? "select" : ""}
          onClick={() => onFilter(FILTER_STATES.all)}
        >
          All
        </button>
        <button
          className={filter === FILTER_STATES.active ? "select" : ""}
          onClick={() => onFilter(FILTER_STATES.active)}
        >
          Active
        </button>
        <button
          className={filter === FILTER_STATES.completed ? "select" : ""}
          onClick={() => onFilter(FILTER_STATES.completed)}
        >
          Completed
        </button>
      </div>
      <div className="clear">
        <span className="clearCompleted">Clear completed</span>
      </div>
    </div>
  );
}

export const loadState = stateName => {
  try {
    const serializedState = localStorage.getItem(stateName);

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (stateName, value) => {
  try {
    const serializedState = JSON.stringify(value);

    localStorage.setItem(stateName, serializedState);
  } catch (err) {
    throw new Error("Can't save changes in local storage");
  }
};

export const removeState = stateName => {
  try {
    localStorage.removeItem(stateName);
  } catch (err) {
    throw new Error("Can't remove item from local storage");
  }
};
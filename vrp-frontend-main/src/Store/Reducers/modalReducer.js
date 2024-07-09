const initialState = {
  openAddLoc: false,
  openRemoveLoc: false,
  index: null,
  loc: null,
};

const reducer = (state = initialState, action) => {
  if (action.type === "OPEN_ADD_LOC") {
    return {
      openAddLoc: true,
      openRemoveLoc: false,
      index: action.payload.index,
      loc: action.payload.loc,
    };
  } else if (
    action.type === "CLOSE_ADD_LOC" ||
    action.type === "CLOSE_DEL_LOC"
  ) {
    return {
      openAddLoc: false,
      openRemoveLoc: false,
      index: null,
      loc: null,
    };
  } else if (action.type === "OPEN_DEL_LOC") {
    return {
      openAddLoc: false,
      openRemoveLoc: true,
    };
  } else {
    return state;
  }
};

export default reducer;

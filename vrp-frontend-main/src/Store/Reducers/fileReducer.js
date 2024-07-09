import axios from "axios";

const initialState = {
  fileData: {},
  fileId:null,
};

const reducer = (state = initialState, action) => {
  if (action.type === "UPLOAD") {
    return {
      fileData: {},
      fileId: action.payload
    };
  } else {
    return state;
  }
};

export default reducer;

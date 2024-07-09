const initialState = {
  solutionData: null,
  routeSolutionStatus: false,
  routeAssigned: false,
  graphReady: false,
  demandType: [],
  solId: null
};

const reducer = (state = initialState, action) => {
  if (action.type === "STORE_SOL") {
    return state;
  } else if (action.type === "SAVE_SOL") {
    return state;
  } else if (action.type === "FETCH_SOL") {
    return {
      ...state,
      solutionData: action.payload,
      routeSolutionStatus: true,
    };
  } else if (action.type === "FETCH_UPDATED_SOL") {
    return {
      ...state,
      solutionData: {
        ...state.solutionData,
        solution: action.payload.result,
        totalDistance: action.payload.totalDistance,
      },
      graphReady: action.payload.graphReady,
    };
  } else if (action.type === "DELETE_SOL") {
    return state;
  } else if (action.type === "READY_VIEW") {
    return {
      ...state,
      graphReady: action.graphReady,
    };
  } else if (action.type === "ROUTE_ASSIGNED") {
    return {
      ...state,
      routeAssigned: action.payload,
    };
  } else if (action.type === "ADD_CHIP") {
    console.log(action.payload);

    const updatedDemand = state.demandType.filter(
      (x) => x.node !== action.payload.node
    );

    return {
      ...state,
      demandType: updatedDemand.concat(action.payload),
    };
  } else if (action.type === "SELECT_SAVED_SOL") {
    return {
      ...state,
      solutionData: action.payload.solData,
      demandType: action.payload.demandType,
      routeSolutionStatus: true,
      graphReady: action.payload.graphReady,
      solId: action.payload.id
    }
  } else {
    return state;
  }
};

export default reducer;

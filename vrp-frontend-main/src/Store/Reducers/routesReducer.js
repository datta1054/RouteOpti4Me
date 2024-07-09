const initialState = {
    mapRoutes: [],
    selectedRoute: null,
}

const reducer = (state = initialState, action) => {
    if (action.type === 'STORE_ROUTES') {
        const payload = action.payload;
        const sortedMapRoutes = [...state.mapRoutes, payload].sort((a, b) => a.index - b.index)
        console.log("STORE ROUTES => ", payload)
        return ({
            mapRoutes: sortedMapRoutes,
            selectedRoute: null,
        });
    } 

    else if (action.type === 'SELECT_ROUTE') {
        return ({
            mapRoutes: [...state.mapRoutes],
            selectedRoute: action.payload,
        });
    }

    else if (action.type === 'EMPTY_ROUTES') {
        return ({
            mapRoutes: [],
            selectedRoute: state.selectedRoute,
        });
    }

    else {
        return state;
    }
}

export default reducer;
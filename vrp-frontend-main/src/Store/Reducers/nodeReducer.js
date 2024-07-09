const initialState = {
    nodes: [],
}

const reducer = (state = initialState, action) => {

    const checkArrItem = (arr, item) => {
        if (arr.includes(item)) return false;
        else return true;
    }

    if (action.type === 'STORE_NODES') {
        const payload = action.payload;
        return ({
            nodes: payload,
        });
    } 

    else if (action.type === 'ADD_NODES') {
        const payload = action.payload;
        return ({
            nodes: [...state.nodes, payload],
        });
    } 

    else if (action.type === 'REMOVE_NODES') {
        const payload = action.payload;
        const temp = state.nodes.filter(node => checkArrItem(payload, node));
        return ({
            nodes: temp,
        });
    }

    else if (action.type === 'SUBMIT_NODES') {
        return state;
    }

    else {
        return state;
    }
}

export default reducer;
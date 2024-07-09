const initialState = {
    savedSolutionsData: [],
};

const reducer = (state = initialState, action) => {
    if (action.type === 'FETCH_SAVED_SOLS') {
        return {
            ...state,
            savedSolutionsData: action.payload
        }
    } else if (action.type === 'DELETE_SAVED_SOL') {
        const new_saved_sols = []
        state.savedSolutionsData.map(sol => {
            if(sol.id !== action.payload) {
                new_saved_sols.push(sol)
            }
        });
        return {
            ...state,
            savedSolutionsData: new_saved_sols
        }
    } else {
        return state;
    }
}

export default reducer;
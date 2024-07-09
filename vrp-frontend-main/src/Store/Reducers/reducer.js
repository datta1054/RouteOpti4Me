import { combineReducers } from "redux";
import fileReducer from './fileReducer';
import routesReducer from './routesReducer';
import nodeReducer from './nodeReducer';
import modalReducer from './modalReducer';
import solutionReducer from './solutionReducer';
import savedSolutionsReducer from './savedSolsReducer';

const reducers = combineReducers({
  file: fileReducer,
  routes: routesReducer,
  nodes: nodeReducer,
  modals: modalReducer,
  solution: solutionReducer,
  savedSolutions: savedSolutionsReducer
});

export default reducers;
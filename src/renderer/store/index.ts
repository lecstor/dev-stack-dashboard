import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

import configReducer from "./configSlice";
import dockerReducer from "./dockerSlice";
import gitReducer from "./gitSlice";

const reducer = combineReducers({
  config: configReducer,
  docker: dockerReducer,
  git: gitReducer,
});

export type RootState = ReturnType<typeof reducer>;

const store = configureStore({ reducer, devTools: true });

export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types

export default store;

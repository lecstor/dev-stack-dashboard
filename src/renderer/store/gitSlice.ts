import { createSlice } from "@reduxjs/toolkit";

import { GitStatus } from "../../types";

type GitState = Record<
  string,
  {
    behindMaster?: number;
    lastFetch?: number;
    status?: GitStatus;
  }
>;

const initialState: GitState = {};

const gitSlice = createSlice({
  name: "git",
  initialState,
  reducers: {
    setGitRepoCommitsBehindMaster: {
      reducer(state, action) {
        if (!state[action.meta.name]) state[action.meta.name] = {};
        state[action.meta.name].behindMaster = action.payload;
      },
      prepare(payload, name) {
        return { payload, meta: { name }, error: undefined };
      },
    },
    setGitRepoLastFetch: {
      reducer(state, action) {
        if (!state[action.meta.name]) state[action.meta.name] = {};
        state[action.meta.name].lastFetch = action.payload;
      },
      prepare(payload, name) {
        return { payload, meta: { name }, error: undefined };
      },
    },
    setGitRepoStatus: {
      reducer(state, action) {
        if (!state[action.meta.name]) state[action.meta.name] = {};
        state[action.meta.name].status = action.payload;
      },
      prepare(payload, name) {
        return { payload, meta: { name }, error: undefined };
      },
    },
  },
});

export const {
  setGitRepoCommitsBehindMaster,
  setGitRepoLastFetch,
  setGitRepoStatus,
} = gitSlice.actions;

export default gitSlice.reducer;

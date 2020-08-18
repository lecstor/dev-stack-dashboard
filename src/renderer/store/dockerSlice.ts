import { createSlice } from "@reduxjs/toolkit";

import { DockerPs } from "../../types";

type DockerState = { ps?: DockerPs };

const initialState: DockerState = {};

const dockerSlice = createSlice({
  name: "docker",
  initialState,
  reducers: {
    setDockerPs(state, action) {
      state.ps = action.payload;
    },
  },
});

export const { setDockerPs } = dockerSlice.actions;

export default dockerSlice.reducer;

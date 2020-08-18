import { createSlice } from "@reduxjs/toolkit";

import { ComposeConfig, ComposeConfigService } from "../../types";

type ConfigState = { compose?: ComposeConfig };

const initialState: ConfigState = {};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setComposeConfig(state, action) {
      state.compose = action.payload;
    },
  },
});

export const { setComposeConfig } = configSlice.actions;

export default configSlice.reducer;

export function selectLocalSourceServices(
  state: ConfigState
): ComposeConfigService[] | undefined {
  if (!state.compose) return;
  const { services } = state.compose;
  if (!services) return;
  return Object.values(services).filter(
    ({ sourceType }) => sourceType !== "image"
  );
}

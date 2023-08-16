import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  isLoading: false,
  error: "",
};
const baseURL = "http://localhost:5000/messages/random";
export const fetchMessage = createAsyncThunk(
  "messages/fetchMessage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(baseURL);
      if (!response.ok) {
        return rejectWithValue(response.statusText || "Something went wrong");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = "";
        state.message = payload;
      })
      .addCase(fetchMessage.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(fetchMessage.rejected, (state, { payload }) => {
        state.error = payload;
        state.isLoading = false;
        state.message = "";
      });
  },
});

export const messageSelector = (state) => state.message;
export default messagesSlice.reducer;

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncState, PaginatedResult } from '@/types';
import { fetchQuotes, type Quote } from '../services/quotesService';

type QuotesState = AsyncState<PaginatedResult<Quote>>;

const initialState: QuotesState = {
  data: null,
  status: 'idle',
  error: null,
};

export const loadQuotes = createAsyncThunk(
  'quotes/load',
  async (args: { page?: number; pageSize?: number } = {}) =>
    fetchQuotes(args.page, args.pageSize),
);

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadQuotes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadQuotes.fulfilled, (state, action: PayloadAction<PaginatedResult<Quote>>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(loadQuotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load quotes';
      });
  },
});

export default quotesSlice.reducer;

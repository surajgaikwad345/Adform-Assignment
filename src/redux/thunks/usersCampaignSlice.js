import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  error: null,
  filters: {
    name: '',
    dateRange: [],
  },
};

const usersCampaignSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.list = action.payload;
    },
    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    stopLoading(state) {
      state.loading = false;
    },
    filterCampaignsByName(state, action) {
      state.filters.name = action.payload;
    },
    filterCampaignsByDateRange(state, action) {
      state.filters.dateRange = action.payload;
    },
    addCampaigns: (state, action) => {
      const newCampaigns = action.payload;
      state.list = [...state.list, ...newCampaigns];
    },
    resetState: () => initialState,
  },
});

export const {
  startLoading,
  fetchSuccess,
  fetchFailure,
  stopLoading,
  filterCampaignsByName,
  filterCampaignsByDateRange,
  addCampaigns,
  resetState,
} = usersCampaignSlice.actions;

export default usersCampaignSlice.reducer;
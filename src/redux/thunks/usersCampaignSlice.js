import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const initialState = {
  list: [],
  filteredList: [],
  loading: false,
  error: null,
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
      const filteredData = state.list.filter(campaign =>
        campaign.name.toLowerCase().includes(action.payload.toLowerCase())
      );
      state.filteredList = filteredData;
    },
    filterCampaignsByDateRange(state, action) {
      if (!action.payload.length) return state.list;

      const filteredData = state.list.filter((campaign) => {
        const start = dayjs(campaign.startDate, 'M/D/YYYY');
        const end = dayjs(campaign.endDate, 'M/D/YYYY');
        const [rangeStart, rangeEnd] = action.payload;

        return (
          start.isBetween(rangeStart, rangeEnd, null, '[]') ||
          end.isBetween(rangeStart, rangeEnd, null, '[]')
        );
      });
      state.filteredList = filteredData;
    },
    addCampaigns: (state, action) => {
      const newCampaigns = action.payload;
      state.list = [...state.list, ...newCampaigns];
      state.filteredList = [...state.filteredList, ...newCampaigns];
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
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../thunks/usersCampaignSlice';

const usersCampaignStore = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default usersCampaignStore;


import { act } from '@testing-library/react';
import { addCampaigns } from '../redux/thunks/usersCampaignSlice';
import usersCampaignStore from '../redux/store/usersCampaignStore';

test('AddCampaigns appends campaigns', () => {
  window.AddCampaigns = (campaigns) => {
    if (!Array.isArray(campaigns)) throw new Error('Input must be an array');
    usersCampaignStore.dispatch(addCampaigns(campaigns));
  };

  const newCampaigns = [
    { id: 11, name: 'Test Campaign', startDate: '10/10/2025', endDate: '11/10/2025', Budget: 1000, userId: 1 }
  ];

  act(() => {
    window.AddCampaigns(newCampaigns);
  });
});

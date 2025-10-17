import { campaignData } from "../../data/campaignData";
import { isCampaignActive, isValidCampaignDateRange } from "../../helpers/helpers";
import { fetchFailure, startLoading, fetchSuccess, stopLoading } from "../thunks/usersCampaignSlice";
import axios from 'axios';

export const fetchUsers = () => async (dispatch) => {
    dispatch(startLoading());
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        if (Array.isArray(response.data)) {
            const campaignsWithUsers = campaignData.map(c => ({
                ...c,
                userName: response.data.find(u => u.id === c.userId)?.name || "Unknown User",
                active: isCampaignActive(c.startDate, c.endDate)
            }))
            const validCampaigns = campaignsWithUsers.filter(c =>
                isValidCampaignDateRange(c.startDate, c.endDate)
            );
            dispatch(fetchSuccess(validCampaigns));
        }
    } catch (error) {
        dispatch(fetchFailure(error.message));
    } finally {
        dispatch(stopLoading());
    }
};
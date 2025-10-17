import reducer, {
    startLoading,
    fetchSuccess,
    fetchFailure,
    stopLoading,
    filterCampaignsByName,
    filterCampaignsByDateRange,
    addCampaigns,
} from '../redux/thunks/usersCampaignSlice';

import dayjs from 'dayjs';

const initialState = {
    list: [],
    filteredList: [],
    loading: false,
    error: null,
};

const mockCampaigns = [
    {
        id: 1,
        name: 'Divavu',
        startDate: '9/19/2021',
        endDate: '3/9/2023',
        Budget: 88377,
        userId: 3,
    },
    {
        id: 2,
        name: 'Jaxspan',
        startDate: '11/21/2023',
        endDate: '2/21/2024',
        Budget: 608715,
        userId: 6,
    },
    {
        id: 3,
        name: 'Realbridge',
        startDate: '3/5/2021',
        endDate: '10/2/2026',
        Budget: 505602,
        userId: 5,
    },
];

test('should handle startLoading', () => {
    const state = reducer(initialState, startLoading());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
});

test('should handle fetchSuccess', () => {
    const state = reducer(initialState, fetchSuccess(mockCampaigns));
    expect(state.loading).toBe(false);
    expect(state.list).toEqual(mockCampaigns);
});

test('should handle fetchFailure', () => {
    const state = reducer(initialState, fetchFailure('Something went wrong'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Something went wrong');
});

test('should handle stopLoading', () => {
    const prevState = { ...initialState, loading: true };
    const state = reducer(prevState, stopLoading());
    expect(state.loading).toBe(false);
});

test('should filter campaigns by name', () => {
    const prevState = {
        ...initialState,
        list: mockCampaigns,
    };

    const state = reducer(prevState, filterCampaignsByName('real'));
    expect(state.filteredList).toHaveLength(1);
    expect(state.filteredList[0].name).toBe('Realbridge');
});

test('should filter campaigns by date range', () => {
    const prevState = {
        ...initialState,
        list: mockCampaigns,
    };

    const rangeStart = dayjs('01/01/2023', 'MM/DD/YYYY');
    const rangeEnd = dayjs('12/31/2023', 'MM/DD/YYYY');

    const state = reducer(prevState, filterCampaignsByDateRange([rangeStart, rangeEnd]));

    expect(state.filteredList.length).toBeGreaterThan(0);
    expect(state.filteredList[0].name).toBe('Divavu');
});

test('should append new campaigns to list and filteredList', () => {
    const prevState = {
        ...initialState,
        list: [mockCampaigns[0]],
        filteredList: [mockCampaigns[0]],
    };

    const newCampaigns = [mockCampaigns[1], mockCampaigns[2]];
    const state = reducer(prevState, addCampaigns(newCampaigns));

    expect(state.list).toHaveLength(3);
    expect(state.filteredList).toHaveLength(3);
});
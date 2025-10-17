export const isCampaignActive = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    today.setHours(12, 0, 0, 0);

    return today >= start && today <= end;
};

export const isValidCampaignDateRange = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    return end >= start;
};

export const convertToDDMMYYYY = (dateStr) => {
    const [month, day, year] = dateStr.split('/');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};
import React from "react";
import { useSelector } from "react-redux";
import { convertToDDMMYYYY } from "../../helpers/helpers";
import { Table } from "antd";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const CampaignsTable = () => {
    const { list, loading, error, filters } = useSelector((state) => state.users);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (data) => data ? convertToDDMMYYYY(data) : '-',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (data) => data ? convertToDDMMYYYY(data) : '-',
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (data) => {
                return (
                    <>
                        {data ?
                            <div className='activeText'>
                                Active
                            </div>
                            :
                            <div className='inactiveText'>
                                Inactive
                            </div>
                        }
                    </>);
            },
        },
        {
            title: 'Budget',
            dataIndex: 'Budget',
            key: 'Budget',
            sorter: (a, b) => a.Budget - b.Budget,
            render: (data) => {
                const formatter = new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 1,
                });
                return `${formatter.format(data)} USD`;
            }
        },
    ];

    const getDataSource = () => {
        const { name, dateRange } = filters;

        return list.filter(campaign => {
            if (name && name.trim() !== '') {
                if (!campaign.name.toLowerCase().includes(name.toLowerCase())) {
                    return false;
                }
            }
            if (Array.isArray(dateRange) && dateRange.length === 2) {
                const [rangeStart, rangeEnd] = dateRange;
                const start = dayjs(campaign.startDate, 'M/D/YYYY');
                const end = dayjs(campaign.endDate, 'M/D/YYYY');
                if (
                    !(
                        start.isBetween(rangeStart, rangeEnd, null, '[]') ||
                        end.isBetween(rangeStart, rangeEnd, null, '[]')
                    )
                ) {
                    return false;
                }
            }
            return true;
        });
    };

    return (
        <Table
            columns={columns}
            dataSource={getDataSource()}
            pagination={false}
            loading={loading}
            locale={{ emptyText: error ? error : 'No Data' }}
            rowKey="id"
        />
    );
}

export default CampaignsTable;
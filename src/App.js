import { DatePicker, Input, message, Table } from 'antd';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './redux/actions/actions';
import { useEffect, useState } from 'react';
import { addCampaigns, filterCampaignsByDateRange, filterCampaignsByName } from './redux/thunks/usersCampaignSlice';
import { convertToDDMMYYYY } from './helpers/helpers';
import ErrorWrapper from './errorBoundaries/ErrorWrapper';
import AddCampaignModal from './addCampaigns/AddCampaignModal';

const { RangePicker } = DatePicker;

function App() {
  const [searchText, setSearchText] = useState('');
  const [selectedRange, setSelectedRange] = useState([]);
  const [minValue, setMinValue] = useState(null);
  const dispatch = useDispatch();
  const { list, filteredList, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    window.AddCampaigns = (campaigns) => {
      if (!Array.isArray(campaigns)) {
        console.error('AddCampaigns expects an array of campaign objects');
        return;
      }

      dispatch(addCampaigns(campaigns));
    };
  }, [dispatch]);

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

  const onNameFilterChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(filterCampaignsByName(value));
  }

  const onDateRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      if (dates[0].isAfter(dates[1])) {
        message.error('End date cannot be before start date');
        return;
      }
      dispatch(filterCampaignsByDateRange(dates));
    } else if (!dates || dates.length === 0) {
      setMinValue(null);
    }
    setSelectedRange(dates || []);
  };

  const onCalendarChange = (dates) => {
    setMinValue(dates[0]);
  }

  return (
    <div className="App CampaignDetails">
      <div className="App-header">
        <div className='title'>Campaign Management</div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <div className='Header-filters'>
            <RangePicker
              onChange={onDateRangeChange}
              onCalendarChange={onCalendarChange}
              minDate={minValue}
              format="DD/MM/YYYY"
              allowClear
              disabledDate={(current) =>
                selectedRange[0] && current.isBefore(selectedRange[0], 'day')
              }
            />
            <Input
              placeholder="Search campaign by name"
              value={searchText}
              onChange={onNameFilterChange}
              style={{ width: 220 }}
              allowClear
            />
          </div>
          <AddCampaignModal users={list} />
        </div>
      </div>
      <ErrorWrapper>
        <Table
          columns={columns}
          dataSource={searchText || selectedRange.length > 0 ? filteredList : list}
          pagination={false}
          loading={loading}
          locale={{ emptyText: error ? error : 'No Data' }}
          rowKey="id"
        />
      </ErrorWrapper>
    </div>
  );
}

export default App;

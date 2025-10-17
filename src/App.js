import { DatePicker, Input, message } from 'antd';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './redux/actions/actions';
import { useEffect, useState } from 'react';
import { addCampaigns, filterCampaignsByDateRange, filterCampaignsByName } from './redux/thunks/usersCampaignSlice';
import ErrorWrapper from './errorBoundaries/ErrorWrapper';
import AddCampaignModal from './components/addCampaigns/AddCampaignModal';
import CampaignsTable from './components/campaignsTable/CampaignsTable';

const { RangePicker } = DatePicker;

function App() {
  const [searchText, setSearchText] = useState('');
  const [selectedRange, setSelectedRange] = useState([]);
  const [minValue, setMinValue] = useState(null);
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.users);

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
    } else if (!dates || dates.length === 0) {
      setMinValue(null);
    }
    dispatch(filterCampaignsByDateRange(dates));
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
        <CampaignsTable searchText={searchText} selectedRange={selectedRange} />
      </ErrorWrapper>
    </div>
  );
}

export default App;

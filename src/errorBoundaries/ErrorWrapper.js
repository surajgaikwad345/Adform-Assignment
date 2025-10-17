import React from 'react';
import { useDispatch } from 'react-redux';
import ErrorBoundary from './ErrorBoundary';
import { resetState } from '../redux/thunks/usersCampaignSlice';
import { fetchUsers } from '../redux/actions/actions';

const ErrorWrapper = ({ children }) => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetState());
    dispatch(fetchUsers());
  };

  return (
    <ErrorBoundary onReset={handleReset}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorWrapper;

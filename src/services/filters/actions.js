import { UPDATE_FILTER,STATE_UPDATE } from './actionTypes';

export const updateFilters = filters => ({
  type: UPDATE_FILTER,
  payload: filters
});

export const stateUpdate = ({ prop, value }) => {
  console.log('stateUpdate prop',prop,' value', value)
  return {
    type: STATE_UPDATE,
    payload: { prop, value }
  };
};

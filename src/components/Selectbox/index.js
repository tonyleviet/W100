import React from 'react';
import PropTypes from 'prop-types';

const Selectbox = ({ name, value, options, classes, handleOnChange, placeHolder, required }) => {
  console.log('Selectbox name', name, ' value ', value);
  if (!options || options.length < 2) {
    options = [
      { value: 0, label: placeHolder }];
  }
  const createOptions = options =>
    options.map(o => (
      <option value={o.value} key={o.value}>
        {o.label}
      </option>
    ));
  const onChangeEvent = e => {
    handleOnChange(e.target)
  }
  return (
    <select name={name} key={name} value={value} required={required}
      onChange={e => onChangeEvent(e)}
      className={classes}>
      {createOptions(options)}
    </select>
  );
};

Selectbox.propTypes = {
  options: PropTypes.array.isRequired,
  classes: PropTypes.string,
  handleOnChange: PropTypes.func.isRequired
};

export default Selectbox;

import React from 'react';
import PropTypes from 'prop-types';

const Selectbox = ({ name, value, options, classes, handleOnChange, placeHolder  }) => {
  console.log('Selectbox name',name, ' value ',value);
  if (!options || !options.length) {
   
    options = [
      { value: 0, label: placeHolder }];
  }
  const createOptions = options =>
    options.map(o => (
      <option value={o.value} key={o.value}>
        {o.label}
      </option>
    ));

  return (
    <select name={name} value={value}
      onChange={e => handleOnChange(e.target)}
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

import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { updateFilters, stateUpdate } from '../../../services/filters/actions';
import { SettingService } from '../../../services/SettingService';
import { FirebaseService } from '../../../services/FirebaseService';
import Checkbox from '../../Checkbox';
import GithubStarButton from '../../github/StarButton';
import Selectbox from '../../Selectbox';
import './style.scss';


class Filter extends Component {
  state = {
    cities: [],
    districts:[]
  };
  constructor(props) {
    super(props)
    SettingService.getCities().then(cities => {
      this.setState({ cities: cities });
    });
    SettingService.getDistricts().then(districts => {
      this.setState({ districts: districts });
    })
  }
  render() {
    const { cities,districts } = this.state;
    return (
      <div className="filters">
        {/*  <h4 className="title">Sizes:</h4>
      {createCheckboxes()} */}
        <div className="filter-section">
          <h4 className="title">Tỉnh/Thành Phố:</h4>
          <Selectbox options={cities}
          //handleOnChange={value => updateSort(value)} 
          />
        </div>
        <div className="filter-section">
          <h4 className="title">Quận/Huyện:</h4>
          <Selectbox options={districts}
          //handleOnChange={value => updateSort(value)} 
          />
        </div>
        {/*   <GithubStarButton /> */}

      </div>
    );
  }

}

const mapStateToProps = state => ({
  cities: state.shelf.cities,
  districts: state.shelf.districts,
  settings: state.shelf.settings,
});
export default connect(
  mapStateToProps,
  { updateFilters, stateUpdate }
)(Filter);

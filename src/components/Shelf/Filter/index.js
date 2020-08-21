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
    districts: [],
    districtOfCity: []
  };
  constructor(props) {
    super(props)
    console.log('Filter Component', props);
    SettingService.getCities().then(cities => {
      this.setState({ cities: cities });
    });
    SettingService.getDistricts().then(districts => {
      this.setState({ districts: districts });
      if (this.props.defaultCity) {
        this.setState({ districtOfCity: districts.filter(x => x.CityID == this.props.defaultCity) });
      }

    })
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('Filter nextProps', nextProps);
    if (nextProps.defaultCity) {
      this.setState({ districtOfCity: this.state.districts.filter(x => x.CityID == nextProps.defaultCity) });
    }
  }

  updateFilterCity(selectedCity) {
    this.props.handleFilter({ selectedCity: selectedCity });
    console.log('Filter updateFilterCity', selectedCity, this.state.districts);
    this.setState({ districtOfCity: this.state.districts.filter(x => x.CityID == selectedCity.value) });
    stateUpdate({ prop: 'selectedCity', value: selectedCity.value })

  }
  updateFilterDistrict(selectedDistrict) {
    this.props.handleFilter({ selectedDistrict: selectedDistrict });
    stateUpdate({ prop: 'selectedDistrict', value: selectedDistrict.value })
  }

  render() {
    const { cities, districtOfCity } = this.state;
    return (
      <div className="filters">
        {/*  <h4 className="title">Sizes:</h4>
      {createCheckboxes()} */}
        <div className="filter-section">
          <h4 className="title">Tỉnh/Thành Phố:</h4>
          <Selectbox options={cities} value={this.props.defaultCity}
            handleOnChange={value => this.updateFilterCity(value)}
          />
        </div>
        <div className="filter-section">
          <h4 className="title">Quận/Huyện:</h4>
          <Selectbox options={districtOfCity} value={this.props.defaultDistrict}
            handleOnChange={value => this.updateFilterDistrict(value)}
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
  selectedCity: state.filters.selectedCity,
  selectedDistrict: state.filters.selectedDistrict,
});
export default connect(
  mapStateToProps,
  { updateFilters, stateUpdate }
)(Filter);

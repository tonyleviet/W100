import React, { Component, useState } from 'react';
import { useHistory } from "react-router-dom"
import { HOME } from "../../constants/routes"
import ChooseLocation from "../../components/ChooseLocation"

import Filter from "./Filter"
import { CACHE_FILTER_KEY } from "../../services/Constants"
import { SettingService } from '../../services/SettingService';
import './style.scss';


class Search extends Component {
    state = {
        selectedCity: 0,
        selectedDistrict: 0,
        selectedCityName: '',
        selectedDistrictName: '',
    };

    constructor(props) {
        super(props)
        console.log('Search Component', props);

        this.handleFilter = this.handleFilter.bind(this);
    }

    componentWillMount() {
        console.log('Search componentWillMount state', this.state);
        if (this.state.selectedDistrictName == "") {
            SettingService.getDistricts().then(districts => {
                var defaultDistrict = districts.filter(x => x.value == this.props.defaultDistrict);
                this.setState({ selectedDistrictName: defaultDistrict[0].label + ',' });
            });
        }
        if (this.state.selectedCityName == "") {
            SettingService.getCities().then(cities => {
                var defaultCity = cities.filter(x => x.value == this.props.defaultCity);
                this.setState({ selectedCityName: defaultCity[0].label });
            });
        }
    }
    onSearch = () => {

    }

    handleFilter = (filters) => {
        console.log('handleFilter update filter', filters);
        var link = document.getElementById("btn-ChooseLocation");
        link.click();
        localStorage.setItem(CACHE_FILTER_KEY, JSON.stringify(filters));

        const filter = localStorage.getItem(CACHE_FILTER_KEY);
        console.log('handleFilter update filter', JSON.parse(filter));

        var btnRefresh = document.getElementById("btn-refresh");
        if (btnRefresh)
            btnRefresh.click();

        //localStorage.setItem('selectedCity', filters.selectedCity);
        //localStorage.setItem('selectedDistrict', filters.selectedDistrict);
        this.setState({ selectedCity: filters.selectedCity });
        this.setState({ selectedCityName: filters.selectedCityName });
        this.setState({ selectedDistrict: filters.selectedDistrict });
        this.setState({ selectedDistrictName: filters.selectedDistrictName + ',' });

    }
    render() {
        return (
            <form className="mr-32 w-1/4
                            xs:text-base xs:ml-2 xs:mr-1 xs:w-full
                            sm:text-base sm:ml-3 sm:mr-2 sm:w-2/5 
                            md:text-base md:ml-3 md:mr-2 md:w-2/5 
                            lg:text-base lg:ml-4 md:mr-4 lg:w-1/4"
                onSubmit={this.onSearch} >
                {/* <input
            className=" 
                   py-2 focus:shadow-outline font-helvetica outline-none
                   rounded-full ml-5 px-5 font-medium placeholder-gray-400
                   tracking-wide w-full"
            type="search"
            name="search"
            placeholder="Search timber"
            aria-label="Search"
            aria-required="false"
        /> */}
                <div className={'box-select-filter'}>
                    <div className={'display-selected-filter'}>
                        <span id="selected-district-name">{this.state.selectedDistrictName}</span>
                        <span id="selected-city-name"> {this.state.selectedCityName}</span>
                    </div>
                    <ChooseLocation handleChooseLocation={this.handleFilter} defaultCity={this.props.defaultCity} defaultDistrict={this.props.defaultDistrict} />
                </div>
            </form>

        );
    }
}

export default Search
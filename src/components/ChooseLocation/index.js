import React, { Component, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateFilters, stateUpdate } from '../../services/filters/actions';
import { SettingService } from '../../services/SettingService';
import Selectbox from '../Selectbox';

class ChooseLocation extends Component {
    state = {
        cities: [],
        districts: [],
        districtOfCity: [],
        show: false,
        selectedCity: 0,
        selectedDistrict: 0
    };

    constructor(props) {
        super(props)
        console.log('Filter Component', props);
        SettingService.getCities().then(cities => {
            this.setState({ cities: cities });
        });
        SettingService.getDistricts().then(districts => {
            this.setState({ districts: districts });
            if (props.defaultCity) {
                this.setState({ districtOfCity: districts.filter(x => x.CityID == props.defaultCity) });
            }

        })
        this.setState({ selectedCity: props.defaultCity});
        this.setState({ selectedDistrict: props.defaultDistrict});
        this.handleSaveChange = this.handleSaveChange.bind(this);
    }
    componentDidMount() {
        if (this.props.defaultCity == 0 || this.props.defaultDistrict == 0) {
            this.setShow(true);
        }
    }
    setShow = (isShow) => {
        this.setState({ show: isShow });
    }
    handleClose = () => this.setShow(false);
    handleSaveChange() {
        var filters = { selectedCity: this.state.selectedCity, selectedDistrict: this.state.selectedDistrict };
        console.log('handleSaveChange update filter', filters);
        this.props.handleChooseLocation(filters);
        this.setShow(false);
    }
    updateFilterCity(selectedCity) {
        console.log('ChooseLocation updateFilterCity', selectedCity.value);
        var districtOfCity = this.state.districts.filter(x => x.CityID == selectedCity.value);
        this.setState({ districtOfCity: districtOfCity });
        console.log('ChooseLocation districtOfCity', districtOfCity);
        this.setState({ selectedCity: parseInt(selectedCity.value) });
        //stateUpdate({ prop: 'selectedCity', value: selectedCity.value })
    }
    updateFilterDistrict(selectedDistrict) {
        this.setState({ selectedDistrict: parseInt(selectedDistrict.value)  });
         //stateUpdate({ prop: 'selectedDistrict', value: selectedDistrict.value })
    }

    render() {
        const { cities, districtOfCity, show } = this.state;

        return (
            <>
                <div>
                    <Button variant="primary" onClick={this.handleShow}> Launch demo modal</Button>
                </div>
                <Modal show={show} onHide={this.handleClose} animation={false} fade={false}  >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="filters">
                            <div className="filter-section">
                                <h4 className="title">Tỉnh/Thành Phố:</h4>
                                <Selectbox options={cities} value={this.state.selectedCity}
                                    handleOnChange={value => this.updateFilterCity(value)}
                                />
                            </div>
                            <div className="filter-section">
                                <h4 className="title">Quận/Huyện:</h4>
                                <Selectbox options={districtOfCity} value={this.state.selectedDistrict}
                                    handleOnChange={value => this.updateFilterDistrict(value)}
                                />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}> Close </Button>
                        <Button variant="primary" onClick={this.handleSaveChange}> Save Changes </Button>
                    </Modal.Footer>
                </Modal>
            </>

        );
    }

}

const mapStateToProps = state => ({
    cities: state.shelf.cities,
    districts: state.shelf.districts,
    settings: state.shelf.settings,
    //selectedCity: state.filters.selectedCity,
    //selectedDistrict: state.filters.selectedDistrict,
});
export default connect(
    mapStateToProps,
    { updateFilters, stateUpdate }
)(ChooseLocation);
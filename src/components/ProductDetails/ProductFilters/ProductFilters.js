import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from 'reactstrap';

import { filterVariants } from  '../../../services/productDetails/productDetailsActions';
import { isArray } from "util";

import './ProductFilter.css';

class ProductFilters extends Component {

    onClickFilterButtonHandler(name, value, isActive) {
        this.props.filterVariants({
            name: name,
            value: isActive ? null : value
        });
    }

    render() {
        let filters = [];

        if (isArray(this.props.selectableAttributes)) {
            this.props.selectableAttributes.forEach(attr => {
                // Create buttons
                const buttons = [];

                if (isArray(attr.values)) {
                    attr.values.forEach(value => {
                        // Check active status
                        let isActive = false, options = {};

                        this.props.filters.forEach(filter => {
                            if (filter.name === attr.name && filter.value === value) {
                                isActive = true;
                            }
                        });

                        // Value is exists in filtered variants
                        let isVarianExists = false;
                        this.props.filteredVariants.forEach(variant => {
                            variant.attributes.forEach(variantAttr => {
                                if (variantAttr.name === attr.name && variantAttr.value === value) {
                                    isVarianExists = true;
                                    return;
                                }
                            });
                        });

                        if (!isVarianExists) {
                            options.disabled = true;
                            isActive = false;
                        }

                        buttons.push(
                            <Button 
                                {...options}
                                className={isActive ? 'active' : ''}
                                onClick={() => this.onClickFilterButtonHandler(attr.name, value, isActive)} 
                                outline key={value}>
                                    {value}
                            </Button>
                        );
                    });
                }

                // Add button group
                filters.push(
                    <div className="filter-group detail-container" key={'group-' + attr.name}>
                        <div className="filter-name detail-title" key={attr.name}>{attr.name}</div>
                        <div className="filter-buttons detail-block">{buttons}</div>
                    </div>
                );
            });
        }

        return (
            <div className="product-filters">
                {filters}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        filters: state.filters,
        filteredVariants: state.filteredVariants,
        selectableAttributes: state.selectableAttributes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        filterVariants: filter => dispatch(filterVariants(filter))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductFilters);

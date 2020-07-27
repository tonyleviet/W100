import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'reactstrap';

import './ProductPricing.css';
import { setPriceRange, setSummary } from '../../../services/productDetails/productDetailsActions';
import { isArray } from 'util';
type Props = {};
class ProductPricing extends Component<Props> {
    constructor(props) {
        super(props)

        console.log('ProductPricing props' ,this.props);
    }
//class ProductPricing extends Component {

    resetPriceRange() {
        this.props.setSummary(0.00);
        this.props.setPriceRange({
            minimumQuantity: 0,
            maximumQuantity: 0,
            price: 0.00
        });
    }

    pricingInputChangeHandler(event) {
        const value = event.target.value;

        if (value != null && value !== '' && isArray(this.props.product.baremList)) {
            let isPriceRangeSet = false;

            const range = [...this.props.product.baremList].sort((a, b) => {
                if (a.maximumQuantity < b.maximumQuantity)
                    return -1;
                if (a.maximumQuantity > b.maximumQuantity)
                    return 1;
                return 0;
            });

            range.forEach(barem => {
                if (value >= barem.minimumQuantity && value <= barem.maximumQuantity) {
                    this.props.setPriceRange(barem);
                    this.props.setSummary(parseFloat(barem.price) * value);
                    isPriceRangeSet = true;
                }
            });

            if (!isPriceRangeSet) {
                if (value > range[range.length - 1].maximumQuantity) {
                    this.props.setPriceRange(range[range.length - 1]);
                    this.props.setSummary(parseFloat(range[range.length - 1].price) * value);
                } else {
                    this.resetPriceRange();
                }
            }
        } else {
            this.resetPriceRange();
        }

    }

    pricingInputKeypressHandler(event) {
        let key = '';

        // Handle paste
        if (event.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            key = event.keyCode || event.which;
            key = String.fromCharCode(key);
        }

        const regex = /[0-9]|\./;

        if (!regex.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) event.preventDefault();
        }
    }

    render() {
        if (isArray(this.props.product.baremList)) {
            const currentPriceRange = this.props.priceRange;

            // Check input validity by current range
            let inputOptions = {};
            /* const range = [...this.props.product.baremList]
            const minRange = range.reduce((min, p) => p.minimumQuantity < min ? p.minimumQuantity : min, range[0].minimumQuantity);

            if (currentPriceRange.minimumQuantity < minRange) {
                inputOptions.invalid = true;
            } else {
                inputOptions = {};
            } */

            // Generate range boxes
            const pricingRanges = '';
            /* const pricingRanges = this.props.product.baremList.map((barem, index, array) => {
                let className = 'pricing-range';

                if (currentPriceRange.price === barem.price) {
                    className += ' active';
                }

                return (
                    <div className={className} key={'range-' + index}>
                        <div>{barem.minimumQuantity} - {barem.maximumQuantity} {array.length === index + 1 ? '+' : ''}</div>
                        <div>{barem.price} {this.props.product.currency}</div>
                    </div>
                );
            }); */

            // Make it happen
            return (
                <div className="product-pricing">
                    <div className='pricing-group detail-container'>
                        <div className="pricing-group-name detail-title">Toptan Fiyat <br /> (Adet)</div>
                        <div className="pricing-group-content detail-block">
                            {pricingRanges}
                        </div>
                    </div>
                    <div className='pricing-group detail-container mb-0'>
                        <div className="pricing-group-name detail-title">Adet</div>
                        <div className="pricing-group-content detail-block">
                            <div className="pricing-range-input">
                                <Input onChange={this.pricingInputChangeHandler.bind(this)}
                                    onKeyPress={this.pricingInputKeypressHandler}
                                    {...inputOptions} />
                                <span>Adet</span>
                            </div>
                            <Button outline color="success" size="sm">Stok Adedi: 500</Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<div>Fiyat aralık bilgisine ulaşılamadı.</div>);
        }
    }
}

const mapStateToProps = state => {
    return {
        product: state.productDetails.product,
        priceRange: state.productDetails.priceRange
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setPriceRange: (range) => dispatch(setPriceRange(range)),
        setSummary: (summary) => dispatch(setSummary(summary))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPricing);
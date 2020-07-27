import React, { Component } from "react";
import { connect } from 'react-redux';

import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
//import './ProductMedia.css';

class ProductMedia extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Carousel>
                <div>
                    <img src="http://react-responsive-carousel.js.org/assets/1.jpeg" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="http://react-responsive-carousel.js.org/assets/2.jpeg" />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img src="http://react-responsive-carousel.js.org/assets/3.jpeg" />
                    <p className="legend">Legend 3</p>
                </div>
            </Carousel>
        );
    }
}

const mapStateToProps = state => {
    return {
        filteredVariants: state.filteredVariants
    }
}

export default connect(mapStateToProps)(ProductMedia);

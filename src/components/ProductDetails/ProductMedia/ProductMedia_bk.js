import React, { Component } from "react";
import { connect } from 'react-redux';

import ScrollMenu from 'react-horizontal-scrolling-menu';
import { isArray } from "util";
import {
    Carousel,
    CarouselItem,
    CarouselControl
} from 'reactstrap';

import './ProductMedia.css';

class ProductMedia extends Component {
    items = [];

    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
    }

    setItems() {
        this.items = [];

        // Iterate product variants if is an array
        if (this.props != null && isArray(this.props.filteredVariants)) {
            this.props.filteredVariants.forEach(variant => {

                // Iterate images if is an array
                if (isArray(variant.images)) {
                    variant.images.forEach(url => {
                        this.items.push({
                            src: url ,
                            altText: '',
                            caption: ''
                        })
                    })
                }
            });
        }
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    getThumbnailMenu() {
        const { activeIndex } = this.state;

        const thumbnails = this.items.map((item, index) => {
            return (
                <div className="menu-item" key={index}>
                    <img onClick={() => this.goToIndex(index)} src={item.src} alt="" />
                </div>
            );
        });

        const Arrow = ({ text, className }) => {
            return (
                <div
                    className={className}
                >{text}</div>
            );
        };

        const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
        const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

        return (
            <div className="App">
                <ScrollMenu
                    data={thumbnails}
                    arrowLeft={ArrowLeft}
                    arrowRight={ArrowRight}
                    selected={activeIndex}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }

    render() {
        const { activeIndex } = this.state;

        // Parse filtered variants into carousel applicable items
        this.setItems();

        // Create slides
        const slides = this.items.map((item) => {
            return (
                <CarouselItem key={item.src + '-' + Math.random()}>
                    <img src={item.src} alt={item.altText} />
                </CarouselItem>
            );
        });

        // Create thumbnail menu
        const menu = this.getThumbnailMenu();

        if (this.items.length > 0) {
            return (
                <div className="product-images">
                    <div className="product-image-big">
                        <Carousel
                            interval={false}
                            activeIndex={activeIndex}
                            next={this.next}
                            previous={this.previous}
                        >
                            {slides}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                        </Carousel>
                    </div>
                    <div className="product-image-thumbnails">
                        {menu}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="product-image-error">Aradığınız kriterlere uygun ürün bulunamamıştır.</div>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        filteredVariants: state.filteredVariants
    }
}

export default connect(mapStateToProps)(ProductMedia);

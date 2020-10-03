import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslation, Trans } from "react-i18next";
import { Row, Form, Col, Button } from 'react-bootstrap';
import { SettingService } from '../../services/SettingService';
import { FirebaseService } from '../../services/FirebaseService';
import Selectbox from '../Selectbox';
import { fetchProduct } from '../../services/addEditProduct/addEditProductActions';
import MultiImageInput from 'react-multiple-image-input';
import './index.scss';
type Props = {};

class AddEditProduct extends Component<Props> {
    state = {
        images: {},
        product: { imageUrls: [] },
        cities: [],
        districts: []
    };

    constructor(props) {
        super(props);

        if (props.match.params.id) {
            console.log('AddEditProduct this.props.match.params', this.props.match.params);
            let productId = this.props.match.params.id
            FirebaseService.getProduct(productId).get().then(querySnapshot => {
                const data = querySnapshot.data();
                console.log('AddEditProduct getProduct(productId)', data);
                data.images = {};
                data.id = productId;
                //this.props.fetchProduct(data);
                this.setState({
                    product: data
                })
            });

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.changeSelectBox = this.changeSelectBox.bind(this);


    }
    componentDidMount() {
        const { t } = this.props;
        SettingService.getCities().then(cities => {
            console.log('componentDidMount getCities', cities);
            cities.unshift({ label: t('label.requireCity'), value: 0 });
            this.setState({ cities: cities });
        });
        SettingService.getDistricts().then(districts => {
            this.setState({ districts: districts });

            console.log('test filter', districts.filter(x => x.CityID == 12));
        });
        console.log('AddEditProduct state', this.state);
    }


    componentWillReceiveProps(nextProps) {

    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        console.log('handleChange name ', name, ' value ', value);
        // this.setState({ ...this.state.product, [name]: value });

        this.setState({
            product: {
                ...this.state.product,
                [name]: value
            }
        })

    }
    changeSelectBox(event) {
        if (event.name == 'city') {
            const selectedCity = this.state.cities[event.selectedIndex];
            //console.log('changeSelectBox selectedCity', selectedCity);
            this.setState({ ...this.state.product, city: selectedCity.value });
            this.setState({ ...this.state.product, cityName: selectedCity.label });
            const selectedDistrict = this.state.districts[10];

            this.setState({ ...this.state.product, district: selectedDistrict.value });
            this.setState({ ...this.state.product, districtName: selectedDistrict.label });

        }
        else if (event.name == 'district') {
            const selectedDistrict = this.state.districts[event.selectedIndex];
            //console.log('changeSelectBox selectedDistrict', selectedDistrict);
            this.setState({ ...this.state.product, district: selectedDistrict.value });
            this.setState({ ...this.state.product, districtName: selectedDistrict.label });

        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.onFormSubmit(this.state);
    }


    productSave = ({ id = null, productUserId, imageUrls, city, cityName, district, districtName, name,
        price, phone, address, description, color, size, active }) => {
        this.uploadImages(imageUrls).then(imagePaths => {
            console.log('productSave reponse', imagePaths);
        });


    };
    uploadImages(imageSources) {
        const maptoArray = Object.keys(imageSources).map((key) => imageSources[key]);
        const imageRequests = maptoArray.map((imageBase64) => {
            return new Promise((resolve, reject) => {

                FirebaseService.uploadImageBase64(imageBase64).then(uploadedFile => {
                    console.log('uploadedFile.downloadURL', uploadedFile);
                    uploadedFile.ref.getDownloadURL().then(resultFilePath => {
                        //console.log('uploadedFile.resultFilePath', resultFilePath);
                        resolve(resultFilePath);
                    })
                    //imagePaths.push(uploadedFile.downloadURL); 

                }).catch(err => {
                    throw err;
                    // Oops, something went wrong. Check that the filename is correct and
                    // inspect err to get more details.
                });

            });
        });

        return Promise.all(imageRequests)
            .then((data) => {
                return data
            })
    };
    onFormSubmit(data) {
        let apiUrl;
        console.log('onFormSubmit data', data);
        this.uploadImages(data.images).then(imagePaths => {
            console.log('onFormSubmit reponse imagePaths', imagePaths);
            data.product.imageUrls = imagePaths;
            const { id, userId, imageUrls, city, cityName, district, districtName, name, price,
                phone, address, description, color, size, active } = data.product;
            //Actions.loadingLightbox();
            console.log("productSaveWithImage-" + id + "-" + userId + "-");
            //return;
            if (!id) {
                FirebaseService.addProduct('userid', imageUrls, city, cityName, district, districtName, name,
                    price, phone, address, description, color, size, active);
            } else {
                FirebaseService.setProduct(id, userId, imageUrls, city, cityName, district, districtName, name,
                    price, phone, address, description, color, size, active);
            }
        });
    }

    render() {
        console.log('render AddEditProduct props', this.props, 'this.state ', this.state);
        const { t } = this.props;

        const { images, cities, districts, product } = this.state;
        const crop = {
            unit: '%',
            aspect: 1 / 1,
            width: '100'
        };

        let pageTitle;
        if (product.id) {
            pageTitle = <h2>{t('title.editProduct')}</h2>
        } else {
            pageTitle = <h2>{t('title.addProduct')}</h2>
        }

        return (
            <div className="main-page">
                {pageTitle}
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="city">
                                <Form.Label>{t('label.city')}</Form.Label>
                                <Selectbox name="city" value={product.city} options={cities} handleOnChange={this.changeSelectBox}></Selectbox>
                            </Form.Group>
                            <Form.Group controlId="city">
                                <Form.Label>{t('label.district')}</Form.Label>
                                <Selectbox name="district" value={product.district} options={districts.filter(x => x.CityID == product.city)}
                                    handleOnChange={this.changeSelectBox} placeHolder={t('label.requireDistrict')} ></Selectbox>
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label> {t('label.name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={this.handleChange}
                                    placeholder={t('label.name')} />
                            </Form.Group>

                            <Form.Group controlId="price">
                                <Form.Label>{t('label.price')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={product.price}
                                    onChange={this.handleChange}
                                    placeholder={t('label.price')} />
                            </Form.Group>
                            <Form.Group controlId="phone">
                                <Form.Label>{t('label.phone')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={product.phone}
                                    onChange={this.handleChange}
                                    placeholder={t('label.phone')} />
                            </Form.Group>
                            <Form.Group controlId="address">
                                <Form.Label>{t('label.address')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={product.address}
                                    onChange={this.handleChange}
                                    placeholder={t('label.address')} />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label> {t('label.description')}</Form.Label>
                                <Form.Control
                                    as="textarea" rows="3"
                                    name="description"
                                    value={product.description}
                                    onChange={this.handleChange}
                                    placeholder={t('label.description')} />
                            </Form.Group>
                            <Form.Group controlId="images">
                                <Form.Label>{t('label.images')}</Form.Label>
                                <MultiImageInput
                                    images={images}
                                    setImages={(images) => {
                                        console.log('setImages', images)
                                        this.setState({ images: images })
                                    }
                                    }
                                    allowCrop={true}
                                    cropConfig={{ crop, ruleOfThirds: true }}
                                />
                                <div style={{
                                    position: 'relative',
                                }}>
                                    {product.imageUrls.map((imageUrl) => <div> <img style={{ width: '100%' }} key={imageUrl} src={imageUrl} />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                right: 5,
                                                top: 5,

                                            }}
                                        >
                                            <span style={{ color: 'black' }}>X</span>
                                        </div>

                                    </div>)}
                                </div>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="hidden" name="id" value={product.id} />
                                <Button variant="success" type="submit">{t('button.save')}</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}


const mapStateToProps = state => {
    console.log('mapStateToProps state.AddEditProduct', state.addEditProduct);
    return state.addEditProduct;


}

const mapDispatchToProps = dispatch => {

    return {
        fetchProduct: (product) => dispatch(fetchProduct(product))
    }
};


//export default withTranslation()(AddEditProduct);
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AddEditProduct));
//export default connect(mapStateToProps, mapDispatchToProps)(AddEditProduct);

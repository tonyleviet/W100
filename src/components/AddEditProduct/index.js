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
        product: {
            imageUrls: [],
            city: 0,
            cityName: "",
            district: 0,
            districtName: ""
        },
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
        else {

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.changeSelectBox = this.changeSelectBox.bind(this);


    }
    componentDidMount() {
        const { t } = this.props;
        SettingService.getCities().then(cities => {
            console.log('componentDidMount getCities', cities);
            //cities.unshift({ label: t('label.requireCity'), value: 0 });
            this.setState({ cities: cities });
        });
        SettingService.getDistricts().then(districts => {
            this.setState({ districts: districts });

            console.log('test filter', districts.filter(x => x.CityID == 12));
            if (!this.state.product.city) {
                var selectedCity = localStorage.getItem('selectedCity');
                var selectedDistrict = localStorage.getItem('selectedDistrict');
                //selectedCity = selectedCity || 0;
                //selectedDistrict = selectedDistrict || 0;
                console.log('AddEditProduct default selectedCitt ', selectedCity, ' selectedDistrict ', selectedDistrict);
                var selectDistricts = districts.filter(x => x.CityID == selectedCity);
                var cityName = selectDistricts[0].CityName;
                var districtName = selectDistricts.filter(x => x.value == selectedDistrict)[0].districtName;

                this.setState({
                    product:
                    {
                        ...this.state.product,
                        cityName: cityName,
                        districtName: districtName,
                        city: parseInt(selectedCity),
                        district: parseInt(selectedDistrict),
                    }
                });
            }
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
    removeImage(imageIndex) {
        console.log('removeImage imageIndex: ', imageIndex);
        const imageUrls = this.state.product.imageUrls;

        if (imageIndex !== -1) {
            imageUrls.splice(imageIndex, 1);
            this.setState({
                product: {
                    ...this.state.product,
                    [imageUrls]: imageUrls
                }
            })
        }


    }
    changeSelectBox(event) {
        console.log('changeSelectBox event: ', event);
        if (event.name == 'city') {
            const selectedCity = this.state.cities[event.selectedIndex];
            console.log('changeSelectBox selectedCity', selectedCity);
            const selectedDistrict = this.state.districts.filter(x => x.CityID == parseInt(selectedCity.value))[0]

            this.setState({
                product:
                {
                    ...this.state.product,
                    city: selectedCity.value,
                    cityName: selectedCity.label,
                    district: selectedDistrict.value,
                    districtName: selectedDistrict.label
                }
            });
        }
        else if (event.name == 'district') {
            const selectedDistrict = this.state.districts.filter(x => x.value == parseInt(event.value))[0]
            this.setState({
                product: {
                    ...this.state.product,
                    district: selectedDistrict.value,
                    districtName: selectedDistrict.label
                }
            });
        }
    }



    productSave = ({ id = null, productUserId, imageUrls, city, cityName, district, districtName, name,
        price, phone, address, description, color, size, active }) => {
        this.uploadImages(imageUrls).then(imagePaths => {
            console.log('productSave reponse', imagePaths);
        });


    };
    uploadImages(imageSources) {
        const maptoArray = Object.keys(imageSources).map((key) => imageSources[key]);
        //console.log('uploadImages(imageSources) imageSources ' , imageSources);
        //console.log('uploadImages(imageSources) maptoArray ' , maptoArray);
        //return maptoArray;
        const imageRequests = maptoArray.map((imageBase64) => {
            return new Promise((resolve, reject) => {
                console.log('uploadImages new Promise imageBase64', imageBase64);
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

    handleSubmit(event) {
        console.log('handleSubmit event', event);
        const form = event.currentTarget;
        console.log('handleSubmit event form.checkValidity()', form.checkValidity());
        console.log('handleSubmit event this.state', this.state);

        if (form.checkValidity() === false ||
            this.state.product.city == 0 || this.state.product.district == 0 || Object.keys(this.state.images).length === 0) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            this.onFormSubmit(this.state);
        }
        event.preventDefault();
        //setValidated(true);
    }

    onFormSubmit(data) {


        console.log('onFormSubmit data', data);

        this.uploadImages(data.images).then(imagePaths => {
            console.log('onFormSubmit reponse imagePaths', imagePaths);
            if (!data.product.imageUrls) {
                data.product.imageUrls = [];
            }
            data.product.imageUrls = data.product.imageUrls.concat(imagePaths);
            const { id, userId, imageUrls, city, cityName, district, districtName, name, price,
                phone, address, description } = data.product;
            //Actions.loadingLightbox();
            console.log("productSaveWithImage-" + id + "-" + userId + "-");
            let color = '';
            let size = '';
            let active = true;
            //return true;
            if (!id) {
                FirebaseService.addProduct('userid', imageUrls, city, cityName, district, districtName, name,
                    price, phone, address, description, color, size, active);
            } else {
                FirebaseService.setProduct(id, userId, imageUrls, city, cityName, district, districtName, name,
                    price, phone, address, description, color, size, active);
            }
            this.setState({
                product: {
                    ...this.state.product,
                    [imageUrls]: data.product.imageUrls
                }
            })

            this.setState({ images: {} })
        });
    }



    render() {
        console.log('render AddEditProduct this.props', this.props);
        console.log('render AddEditProduct this.state ', this.state);
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

                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group controlId="city">
                                <Form.Label>{t('label.city')}</Form.Label>
                                <Selectbox required={true} name="city" value={product.city} options={cities} handleOnChange={this.changeSelectBox}></Selectbox>
                            </Form.Group>
                            <Form.Group controlId="city">
                                <Form.Label>{t('label.district')}</Form.Label>
                                <Selectbox required={true} name="district" value={product.district} options={districts.filter(x => x.CityID == product.city)}
                                    handleOnChange={this.changeSelectBox} placeHolder={t('label.requireDistrict')} ></Selectbox>
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label> {t('label.name')}</Form.Label>
                                <Form.Control required
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={this.handleChange}
                                    placeholder={t('label.name')} />
                            </Form.Group>

                            <Form.Group controlId="price">
                                <Form.Label>{t('label.price')}</Form.Label>
                                <Form.Control required
                                    type="text"
                                    name="price"
                                    value={product.price}
                                    onChange={this.handleChange}
                                    placeholder={t('label.price')} />
                            </Form.Group>
                            <Form.Group controlId="phone">
                                <Form.Label>{t('label.phone')}</Form.Label>
                                <Form.Control required
                                    type="text"
                                    name="phone"
                                    value={product.phone}
                                    onChange={this.handleChange}
                                    placeholder={t('label.phone')} />
                            </Form.Group>
                            <Form.Group controlId="address">
                                <Form.Label>{t('label.address')}</Form.Label>
                                <Form.Control required
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
                                    defaultValue=""
                                    value={product.description}
                                    onChange={this.handleChange}
                                    placeholder={t('label.description')} />
                            </Form.Group>
                        </Col>
                        <Col >
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
                                    {product.imageUrls.map((imageUrl, index) => {
                                        return (
                                            <div className={'box-thumbnail'} key={'box-thumbnail-' + index} >
                                                <img style={{ maxWidth: '100px', maxHeight: "100px" }} key={'img-' + index} src={imageUrl} />
                                                <div className={'box-close'}
                                                >
                                                    <button type="button" style={{ color: 'black' }} onClick={() => { this.removeImage(index) }} >X</button>
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                            </Form.Group>
                        </Col>
                        <Form.Group>
                            <Form.Control type="hidden" name="id" value={product.id} />
                            <Button variant="success" type="submit">{t('button.save')}</Button>
                        </Form.Group>
                    </Row>
                </Form>
            </div >
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

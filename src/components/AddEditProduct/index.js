import React, { useState } from 'react';
import { Row, Form, Col, Button } from 'react-bootstrap';
import { SettingService } from '../../services/SettingService';
import { FirebaseService } from '../../services/FirebaseService';
import Selectbox from '../Selectbox';
import { withTranslation, Trans } from "react-i18next";
import MultiImageInput from 'react-multiple-image-input';
import './index.scss';
class AddEditProduct extends React.Component {

    constructor(props) {
        super(props);
        this.initialState = {
            id: 0,
            name: '',
            price: '',
            description: '',
            cityName: '',
            city: 0,
            districtName: '',
            district: 0,
            cities: [],
            districts: [],
            images: {},
            active:false,
            address:'',
            phone:'',
            color:'',
            size:'',
            imageUrls:[],
        }

        if (props.product) {
            this.state = props.product
        } else {
            this.state = this.initialState;
        }
      
        this.state.images = {};
        this.state.cities = [];
        this.state.districts = [];

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
            this.initialState.cities = cities;
        });
        SettingService.getDistricts().then(districts => {
            this.setState({ districts: districts });
            this.initialState.districts = districts;
    
            console.log('test filter', districts.filter(x => x.CityID == 12));
        });
       
    }


  componentWillReceiveProps(nextProps) {
   
  }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }
    changeSelectBox(event) {
        if (event.name == 'city') {
            const selectedCity = this.state.cities[event.selectedIndex];
            //console.log('changeSelectBox selectedCity', selectedCity);
            this.setState({ city: selectedCity.value })
            this.setState({ cityName: selectedCity.label })
            const selectedDistrict = this.state.districts[10];
            this.setState({ district: selectedDistrict.value })
            this.setState({ districtName: selectedDistrict.label })
        }
        else if (event.name == 'district') {
            const selectedDistrict = this.state.districts[event.selectedIndex];
            //console.log('changeSelectBox selectedDistrict', selectedDistrict);
            this.setState({ district: selectedDistrict.value })
            this.setState({ districtName: selectedDistrict.label })

        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.onFormSubmit(this.state);
        this.setState(this.initialState);
    }


    productSave = ({ id = null, productUserId, imageUrls, city, cityName, district, districtName, name,
        price, phone, address, description, color, size, active }) => {
        this.uploadImages(imageUrls).then(imagePaths => {
            console.log('productSave reponse', imagePaths);
            /*  AuthService.updateUser(null, null, phone, address);
             // return;
             //console.log('productSave imagePaths', imagePaths);
             //console.log('productSave userId', userId);
 
             Actions.pop();
             var productToUpdate = {
                 id, userId, imageUrls: imagePaths, city, cityName, district, districtName, name,
                 price, phone, address, description, color, size, active
             };
             console.log('productSave productToUpdate', productToUpdate);
             //Actions.loadingLightbox();
             productSaveWithImage(dispatch, productToUpdate); */
        });


    };
    uploadImages(imageSources) {
        const maptoArray = Object.keys(imageSources).map((key) => imageSources[key]);
        const imageRequests = maptoArray.map((imageBase64) => {
            return new Promise((resolve, reject) => {

                FirebaseService.uploadImageBase64(imageBase64).then(uploadedFile => {
                    console.log('uploadedFile.downloadURL', uploadedFile);
                    uploadedFile.ref.getDownloadURL().then(resultFilePath =>{
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
            data.imageUrls = imagePaths;
            const { id, userId, imageUrls, city, cityName, district, districtName, name, price,
                phone, address, description, color, size, active } = data;
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

            /* result.then(() => {
                    dispatch({ type: PRODUCT_SAVE });
                    //Actions.pop();//back to my product screen
                    //Actions.refresh();
                    Actions.pop();
                    setTimeout(() => {
                        Actions.refresh({
                            p: Math.random()
                        });
                    }, 0);
                })
                .catch(() => {
                    Alert.alert(
                        i18n.t('app.attention'),
                        i18n.t('product.save.failureMessage'),
                        [{ text: i18n.t('app.ok') }],
                        { cancelable: true }
                    );
                }); */

        });
    }

    render() {


        const { cities, districts } = this.state;
        const { t } = this.props;
        const crop = {
            unit: '%',
            aspect: 1 / 1,
            width: '100'
        };

        let pageTitle;
        if (this.state.id) {
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
                                <Selectbox name="city" value={this.state.city} options={cities} handleOnChange={this.changeSelectBox}></Selectbox>
                            </Form.Group>
                            <Form.Group controlId="city">
                                <Form.Label>{t('label.district')}</Form.Label>
                                <Selectbox name="district" value={this.state.district} options={districts.filter(x => x.CityID == this.state.city)}
                                    handleOnChange={this.changeSelectBox} placeHolder={t('label.requireDistrict')} ></Selectbox>
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label> {t('label.name')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    placeholder={t('label.name')} />
                            </Form.Group>

                            <Form.Group controlId="price">
                                <Form.Label>{t('label.price')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    placeholder={t('label.price')} />
                            </Form.Group>
                            <Form.Group controlId="phone">
                                <Form.Label>{t('label.phone')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={this.state.phone}
                                    onChange={this.handleChange}
                                    placeholder={t('label.phone')} />
                            </Form.Group>
                            <Form.Group controlId="address">
                                <Form.Label>{t('label.address')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    placeholder={t('label.address')} />
                            </Form.Group>
                            <Form.Group controlId="description">
                                <Form.Label> {t('label.description')}</Form.Label>
                                <Form.Control
                                    as="textarea" rows="3"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    placeholder={t('label.description')} />
                            </Form.Group>
                            <Form.Group controlId="images">
                                <Form.Label>{t('label.images')}</Form.Label>
                                <MultiImageInput
                                    images={this.state.images}
                                    setImages={(images) => {
                                        console.log('setImages', images)
                                        this.setState({ images: images })
                                    }
                                    }
                                    allowCrop={true}
                                    cropConfig={{ crop, ruleOfThirds: true }}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="hidden" name="id" value={this.state.id} />
                                <Button variant="success" type="submit">{t('button.save')}</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withTranslation()(AddEditProduct);

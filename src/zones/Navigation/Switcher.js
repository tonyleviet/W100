import React from "react"
import { Switch, Route } from "react-router-dom"
import MyShelf from "../../components/MyShelf";
import Shelf from '../../components/Shelf';
import ProductDetails from '../../components/ProductDetails';
import AddEditProduct from '../../components/AddEditProduct';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import Home, {
    FeaturesPage,
    ProductsPage,
    CustomersPage,
    SalesPage,
    LoginPage
} from "../../pages"

const Switcher = (props) => {
    console.log('Switcher props', props);
    return (
        <CacheSwitch>
            <Route path="/features">
                <FeaturesPage />
            </Route>
            <Route path="/products">
                <ProductsPage />
            </Route>
            <Route path="/customers">
                <CustomersPage />
            </Route>
            <Route path="/sales">
                <SalesPage />
            </Route>
            <Route path="/login">
                <LoginPage />
            </Route>
            <CacheRoute path="/home" exact >
                <Shelf defaultCity={props.defaultCity} defaultDistrict={props.defaultDistrict} />
            </CacheRoute>
            <Route path="/" exact >
                <Shelf defaultCity={props.defaultCity} defaultDistrict={props.defaultDistrict} />
            </Route>
            <Route path="/myproducts" exact >
                <MyShelf />
            </Route>
            <Route path="/ProductDetails/:id" component={ProductDetails} exact />
            <Route path="/AddEdit/:id" component={AddEditProduct} rexact />
            <Route path="/addnew" component={AddEditProduct} rexact />
        </CacheSwitch>)
}
export default Switcher
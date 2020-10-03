import React from "react"
import { Switch, Route } from "react-router-dom"
import Shelf from '../../components/Shelf';
import Home, {
    FeaturesPage,
    ProductsPage,
    CustomersPage,
    SalesPage,
    LoginPage
} from "../../pages"

const Switcher = () => (
    <Switch>
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
        <Route path="/" exact >
            <Shelf defaultCity={1} defaultDistrict={0} />
        </Route>
    </Switch>)

export default Switcher
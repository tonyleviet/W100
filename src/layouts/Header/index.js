import React, { Fragment } from "react"
import Logo from "../../zones/Logo"
import SignUpButton from "../../zones/Signup"
import SearchField from "../../zones/Search"
import Navigation from "../../zones/Navigation"
import { LoginLink } from "../../zones/Login"

const Header = (props) => {
    console.log('Header prop', props);
    return (

        <Fragment>
            <header className="xs:px-2 sm:py-2
                           sm:px-6 sm:py-3
                           md:px-8 sm:py-4
                           flex justify-start bg-brand-dark py-4 px-10 items-center ">
                <Logo />
                <SearchField defaultCity={props.defaultCity} defaultDistrict={props.defaultDistrict} />
                <div className="flex flex-grow items-center">
                    <div className="xs:hidden sm:hidden md:hidden">
                        <Navigation />
                    </div>
                    <div className="box-login flex xs:hidden items-center ml-auto">
                        {/* <SignUpButton /> */}
                        <LoginLink />
                    </div>
                </div>
            </header>
        </Fragment>)
}
export default Header
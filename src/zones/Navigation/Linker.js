import React from "react"
import * as ROUTES from "../../constants/routes"
import { NavLink } from "react-router-dom"
import FeatureLink from "./Links/Features"
import { withTranslation, Trans } from "react-i18next";
const Linker = (props) => {
    const { t } = props;
    return (
        <nav>
            <ul className="flex text-white font-helvetica tracking-wide text-base xs:text-xs sm:text-sm md:text-sm justify-between xs:px-6">
                {/* <FeatureLink /> */}
                <li className="xl:mr-6 sm:mr-8 md:mr-8 mr-4"><NavLink to={ROUTES.HOME.link} activeClassName="cursor-pointer text-orange-400"> {t(ROUTES.HOME.name)}</NavLink></li>
                <li className="xl:mr-6 sm:mr-8 md:mr-8 mr-4"><NavLink to={ROUTES.MYPRODUCTS.link} activeClassName="cursor-pointer text-orange-400"> {t(ROUTES.MYPRODUCTS.name)}</NavLink></li>
                <li className="xl:mr-6 sm:mr-8 md:mr-8 mr-4"><NavLink to={ROUTES.ADDNEW.link} activeClassName="cursor-pointer text-orange-400"> {t(ROUTES.ADDNEW.name)}</NavLink></li>
                {/* <li className="xl:mr-6 sm:mr-8 md:mr-8 mr-4"><NavLink to={ROUTES.CUSTOMERS.link} activeClassName="cursor-pointer text-orange-400" >{ROUTES.CUSTOMERS.name}</NavLink></li> */}
                {/* <li className="xl:mr-6 sm:mr-8 md:mr-8 mr-4"><NavLink to={ROUTES.SALES.link} activeClassName="cursor-pointer text-orange-400">{ROUTES.SALES.name}</NavLink></li> */}
            </ul>
        </nav>
    )
}

export default withTranslation()(Linker);
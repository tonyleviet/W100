import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

class SafeLink extends Component {
    onClick(event) {
        AuthService.isSignedIn().then(isLogged => {
            console.log(this.props);
            console.log('isLogged', isLogged);
            var isPrevent = false;
            if (this.props.requireAuth == true && isLogged == false) {
                console.log('Require login');
                isPrevent = true;
            }

            if (this.props.to === this.props.history.location.pathname) {
                isPrevent = true;
            }
            if (isPrevent === false) {
                this.props.history.push(this.props.to);
            }
            /*  // Ensure that if we passed another onClick method as props, it will be called too
             if (this.props.onClick) {
                 this.props.onClick();
             } */
        });
        event.preventDefault();
    }

    render() {
        const { children, onClick, ...other } = this.props;
        return <Link onClick={this.onClick.bind(this)} {...other}>{children}</Link>
    }
}

export default withRouter(SafeLink);
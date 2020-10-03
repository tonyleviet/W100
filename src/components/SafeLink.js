import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { AuthService } from '../services/AuthService';

class SafeLink extends Component {
    onClick(event) {
        AuthService.isSignedIn().then(isLogged => {
            console.log(this.props);
            console.log('isLogged', isLogged);
            var isPrevent = false;
            if (this.props.requireauth == true && isLogged == false) {
                isPrevent = true;
                var loginBtn = this.props.loginbtn;
                console.log('SafeLink login', this.props.requireauth, 'loginBtn ', loginBtn);
                if (loginBtn.current)
                    loginBtn.current.click();
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
    componentDidMount() {

    }
    render() {
        const { children, onClick, ...other } = this.props;
        return <Link onClick={this.onClick.bind(this)} {...other}>{children}</Link>
    }
}

export default withRouter(SafeLink);
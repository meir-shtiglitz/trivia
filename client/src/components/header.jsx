import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";


class Header extends Component {
    state = {
        mobile_menu: false,
        show: false
    }

    refMobMenu = React.createRef();
    refToo = React.createRef();

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (!this.refToo.current || !event.target) return;
        if (
            this &&
            this.refMobMenu &&
            this.refMobMenu.current &&
            this.refToo &&
            this.refToo.current &&
            event &&
            event.target &&
            !this.refMobMenu.current.contains(event.target) &&
            !this.refToo.current.contains(event.target)
        ) {
            setTimeout(() => this.setState({
                mobile_menu: false, show: false
            }),200);
        }
    };

    drop = () => {
        this.setState(prevState => ({ show: !prevState.show }));
    }

    open_mob_menu = () => {
        this.setState(prevState => ({ mobile_menu: !prevState.mobile_menu }));
    }

    log_out = () => {
        localStorage.removeItem('user');
        window.location = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    }

    logedornot = () => {
        let user = localStorage.getItem("user");
        if (!user) {
            return (
                <Link to="login" className="btn btn-primary-outline border border-primary mr-5">התחבר</Link>
            )
        } else {
            user = jwt_decode(user);
            return (
                <div className="nav-item dropdown mr-5">
                    <span style={{ color: 'blue' }} ref={this.refToo} onClick={this.drop} className="nav-link dropdown-toggle">{user.foo.name} מחובר </span>
                    <div className={`dropdown-menu ${this.state.show && "show"}`} aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to="/profile">ערוך פרופיל</Link>
                        <button onClick={this.log_out} className="dropdown-item">התנתק</button>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link className="navbar-brand" to="/"><img style={{ height: '50px', marginRight: '-25px' }} src="/logo.png" alt="" /></Link>
                    <button className="navbar-toggler" ref={this.refMobMenu} onClick={this.open_mob_menu}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse  ${this.state.mobile_menu && "show"}`} id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink exact className="nav-link" to="/">כל המשחקים</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/logame">משחקים פרטיים</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin">המשחקים שלי</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">
                                    צור קשר
                                </NavLink>
                            </li>
                        </ul>
                        <div className="text-start">{this.logedornot()}</div>
                    </div>
                </nav>
            </div>
        );
    }
}
export default Header;

// total rows before fix 120
import React, { Component } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";

class Register extends Component {
    state = { 
        name: '',
        email: '',
        phone: '',
        password: '',
        status: ''
    }
    
    clicker = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    send = () => {
        var self = this;
        var user = this.state;
        console.log(user);
        axios.get(`${apiUrl}/register`, {
            params:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: user.password
            }
        })
        .then(function(res){
            var callback = res.data.response;
            if(callback === 3){
                self.setState({status: 'כתובת מייל זו כבר קיימת במערכת נא הזינו כתובת מייל שונה '});
            } else{
                Swal.fire({
                    title: 'ברוכים הבאים ' + user.name,
                    text: 'כעת אתם יכולים ליצור משחקים שלכם ולשלוח לכל החברים',
                    icon: 'success',
                    confirmButtonText: 'המשך לאתר' 
                  })
                  .then(function (result) {
                    localStorage.setItem("user", callback);
                   window.location = '/';
                  })
            }
             
        })
    }

    render() { 
        return (
            <React.Fragment>
            <div className="container">
                <div className="m-5"></div>
                <form className="card p-3 text-right col-sm-4 m-auto">
                    <div className="card-header text-center">
                        <h2 className="card-title">הרשמה</h2>
                    </div>
                        <div className="form-group">
                        <label htmlFor="inputEmail4">שם</label>
                        <input onChange={this.clicker} name="name" type="email" className="form-control" id="inputEmail4" placeholder="israel israeli" />
                        </div>
                        <div className="form-group">
                        <label htmlFor="inputPassword4">כתובת מייל</label>
                        <input onChange={this.clicker} name="email" type="email" className="form-control" id="inputPassword4" placeholder="israel@israeli.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress">טלפון</label>
                        <input onChange={this.clicker} name="phone" type="number" className="form-control" id="inputAddress" placeholder="0509876543" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddress2">סיסמה</label>
                        <input onChange={this.clicker} name="password" type="text" className="form-control" id="inputAddress2" placeholder="*********" />
                    </div>
                    <button onClick={this.send} type="button" className="btn btn-primary">צור חשבון</button>
                    <div>{this.state.status}</div>
                    <Link to="/login">כבר יש לי חשבון...</Link>

                </form>
            </div>
            </React.Fragment>
        );
    }
}
 
export default Register;
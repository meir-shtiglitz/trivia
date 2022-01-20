import React, { Component } from "react";
import axios from "axios";
//import reactdom from "react-dom";
import { Link } from "react-router-dom";
import { ApiUrl } from "../api/apiUrl";




class Login extends Component {
    state = { 
        status: ''
     }

    clicker = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    sign = () => {
        var self = this;
        var user = this.state;
        var data = {
            email: user.usernameoremail,
            password: user.password
        };
        axios.post(`${ApiUrl}/login`,data)
        .then(function(res){
            console.log(res);
            var token = res.data.result;
            if(res.data.result){
                if(res.data.result === 3){
                    self.setState({status:'משתמש זה לא קיים במערכת'});
                    return;
                }
                if(res.data.result === 2){
                    self.setState({status:'סיסמה שגויה'});
                    return;
                } else{
                    localStorage.setItem("user", token);
                    window.location = '/';
                }
            }
        })
    }

    status(){
        return this.state.status;
    }
    render() { 
        console.log("process.env.REACT_APP_API_URL",process.env.REACT_APP_API_URL)
        // alert(`${JSON.parse(apiUrl)}login`)
        return ( 
            <div className="container mb-5">
                <div className="m-5"></div>
                <form className="card text-right m-auto p-3 col-sm-4">
                    <div className="card-header text-center">
                        <h2 className="card-title">התחברות</h2>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">הזינו כתובת מייל</label>
                        <input onChange={this.clicker} name="usernameoremail" type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">הזינו סיסמה</label>
                        <input onChange={this.clicker} name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="" />
                    </div>
                    {/* <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div> */}
                    <button onClick={this.sign} type="button" className="btn btn-primary">התחבר</button>
                    <div className="card-tools d-inline">
                        <Link to="/register">הרשם עכשיו...</Link>
                    </div>
                    <div className="status">{this.status()}</div>
                </form>
            </div>
         );
    }
}
 
export default Login;
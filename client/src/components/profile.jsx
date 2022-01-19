import React, { Component } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { apiUrl } from "../config.json";



class Profile extends Component {
    
    state = { 
        user: {},
        status: ''
    }
    
    inputer = (e) => {
        console.log(this.state);
        this.setState(user => ({
            user: {                   // object that we want to update
                ...user.user,    // keep all other key-value pairs
                [e.target.name]: e.target.value       // update the value of specific key
            }
        }))
        
     }



    save = () => {
        // var self = this;
        var { user } = this.state;
        console.log(user);
        axios.get(`${apiUrl}/user/update`, {
            params:user
        })
        .then(function(res){
            
            console.log(res);
                Swal.fire({
                    title: 'פרופיל עודכן בהצלחה',
                    icon: 'success',
                  })
                  .then(function (result) {
                    document.getElementById('navbarDropdown').innerText = user.name + ' מחובר';
                    user = res.data.result;
                    console.log(user);
                    localStorage.setItem("user", user);
                  })
        })
    }

    componentDidMount(){
        var get_user = localStorage.getItem('user');
        get_user = jwt_decode(get_user);
        this.setState({user:get_user.foo});
        this.setState(user => ({
            user: {                   // object that we want to update
                ...user.user, // keep all other key-value pairs
                id:get_user.id,   
                password: ''      // update the value of specific key
            }
        }))
    }
    user = '';
    profile_form() {
        var {user} = this.state;
        if(!user) return;
        return(
            <form className="card m-auto col-sm-4 p-3 text-right">
                <div className="card-header text-center">
                    <h2 className="card-title">הפרופיל שלי</h2>
                </div>
                    <div className="form-group">
                    <label htmlFor="inputEmail4">שם</label>
                    <input onChange={this.inputer} name="name" type="text" className="form-control" id="inputEmail4" value={user.name} />
                    </div>
                    <div className="form-group">
                    <label htmlFor="inputPassword4">כתובת מייל</label>
                    <input onChange={this.inputer} name="email" type="email" className="form-control" id="inputPassword4" value={user.email} />
                </div>
                <div className="form-group">
                    <label htmlFor="inputAddress">טלפון</label>
                    <input onChange={this.inputer} name="phone" type="number" className="form-control" id="inputAddress" value={user.phone} />
                </div>
                <div className="form-group">
                    <label htmlFor="inputAddress2">סיסמה</label>
                    <input onChange={this.inputer} name="password" type="text" className="form-control" id="inputAddress2" placeholder="*********" />
                </div>
                <div className="row">
                    <button onClick={this.save} type="button" className="btn btn-primary col-5 m-auto">שמור </button>
                    <Link to='/' className="btn btn-danger col-5 m-auto">ביטול</Link>
                </div>
                <div>{this.state.status}</div>

            </form>
        )
    }

    render() { 
        console.log(this.state.user);

        return (
            <React.Fragment>
            <div className="row text-center mt-5">{this.profile_form()}</div>
            </React.Fragment>
        );
    }
}
 
export default Profile;
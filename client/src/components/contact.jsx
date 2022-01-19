import React, { Component } from "react";
import { MDBContainer, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import Swal from "sweetalert2";
import axios from "axios";
import "./contact.css"
import { apiUrl } from "../config.json";
import { sendMailContact } from "../api/contact";

class Contact extends Component {
    state = { name: '', email: '', subject: '', msg: '', status: '' }

    inputer = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    updateState = (data) => {
        this.setState({ ...data })
    }

    send = () => {
        sendMailContact(this.state, this.updateState);
    }

    render() {
        return (
            <MDBContainer>
                <div className="row text-center mt-5">
                    <div className="col-sm-5 card p-3 m-auto">
                        <form className="text-right contact_form">
                            <h2 className="text-center"> כתבו לנו</h2>
                            <div className="grey-text">
                                <label>שם:
                                    <MDBInput onInput={this.inputer} name="name" icon="user" group type="text" value={this.state.name} validate error="wrong"
                                        success="right" />
                                </label>
                                <label>כתובת מייל:
                                    <MDBInput onInput={this.inputer} name="email" value={this.state.email} icon="envelope" group type="email" validate error="wrong"
                                        success="right" />
                                </label>
                                <label>נושא:
                                    <MDBInput onInput={this.inputer} name="subject" value={this.state.subject} icon="tag" group type="text" validate error="wrong" success="right" />
                                </label>
                                <label>תוכן ההודעה:
                                    <MDBInput onInput={this.inputer} name="msg" value={this.state.msg} type="textarea" rows="3" icon="pencil-alt" />
                                </label>
                            </div>
                            <div className="text-center">
                                <MDBBtn onClick={this.send} color="secondary" className="col-sm-5">
                                    <span>  שלח  </span>
                                    <MDBIcon far icon="paper-plane" className="ml-1" />
                                </MDBBtn>
                            </div>
                        </form>
                    </div>
                </div>
            </MDBContainer>
        );
    }
}
export default Contact;

// total rows before fixing 104
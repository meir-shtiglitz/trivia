import React, { useState } from "react";
import { MDBIcon, MDBInput } from 'mdbreact';
import "./contact.css"
import { sendMailContact } from "../api/contact";

const initState = { name: '', email: '', subject: '', msg: '', status: '' };

const Contact = () => {
    const [state, setState] = useState(initState);

    const inputer = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const updateState = (data) => {
        setState({ ...state, ...data });
    };

    const send = () => {
        sendMailContact(state, updateState);
        setState(initState);
    };

    return (
        <div>
            <div className="row text-center mt-5">
                <div className="col-sm-5 card p-3 m-auto">
                    <form className="text-right contact_form">
                        <h2 className="text-center"> כתבו לנו</h2>
                        <div className="grey-text">
                            <label>שם:
                                <MDBInput onInput={inputer} name="name" icon="user" group type="text" value={state.name} validate error="wrong"
                                    success="right" />
                            </label>
                            <label>כתובת מייל:
                                <MDBInput onInput={inputer} name="email" value={state.email} icon="envelope" group type="email" validate error="wrong"
                                    success="right" />
                            </label>
                            <label>נושא:
                                <MDBInput onInput={inputer} name="subject" value={state.subject} icon="tag" group type="text" validate error="wrong" success="right" />
                            </label>
                            <label>תוכן ההודעה:
                                <MDBInput onInput={inputer} name="msg" value={state.msg} type="textarea" rows="3" icon="pencil-alt" />
                            </label>
                        </div>
                        <div className="text-center">
                            <div onClick={send} className="col-sm-5 btn btn-secondary">
                                <span>  שלח  </span>
                                <MDBIcon far icon="paper-plane" className="ml-1" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;

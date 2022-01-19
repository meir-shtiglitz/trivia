import React, { Component } from "react";
import Swal from 'sweetalert2';


class SAlert extends Component {
    constructor(props){
        super(props);
        this.state = {
            alert: false
        }
    }

    make_alert = () => {
        const html = this.props.html;
        const title = this.props.title;
        const text = this.props.text;
        const icon = this.props.icon;
        const ic_html = this.props.ic_html;
        const c_b_text = this.props.c_b_text;
        Swal.fire({
            title: title,
            text: text,
            html: html,
            icon: icon,
            iconHtml: ic_html,
            confirmButtonText: c_b_text,
        })
        .then(() => this.props.then())
    }
    render() {
        alert()
        this.make_alert();
        return ( 
                  <span></span>     
                );
    }
}
 
export default SAlert;

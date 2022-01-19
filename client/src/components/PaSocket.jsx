import { Component } from "react";
import Socket from "./Socket";
// import { apiUrl } from "../config.json";
// import socketIOClient from "socket.io-client";

class PaSocket extends Component {
    state = {  }

    next = () => {
        alert();
    }

    render() { 
        return ( 
            <Socket button={true} next={this.next} />
         );
    }
}
 
export default PaSocket;
import { Component } from "react";
import Socket from "./Socket";

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
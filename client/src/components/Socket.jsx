import { Component } from "react";
import { ApiUrl } from "../api/apiUrl";
import socketIOClient from "socket.io-client";

class Socket extends Component {
    state = { 
        getMsg: 'המשחק כבר מתחיל...',
        message: '',
        name: '',
        room: '',
        next: false,
        start: true,//להתחלת המשחק
        questNum: 0,//מספר השאלה
        listConnected: [],
        animateWrite: ""
     }

    socket = '';

     componentDidMount = async()=>{
        await this.setState({room: this.props.room, name: this.props.name})
        this.socket = await socketIOClient(ApiUrl,{query:{name: this.state.name}});
         if (this.socket) this.socket.emit('join', this.state.room, this.state.name);
        this.render();
     }

     handleChange = (e) => {
         this.setState({[e.target.name]:e.target.value})
     }

     handleClick = (e) => {
        e.preventDefault();
        const room = this.state.room;
        const from = this.state.name;
        const message = {type: 'msg', data: this.state.message};
        this.socket.emit('msg', { message, room, from});
         this.setState({message: ''})
     }

     clickNext = async(start) => {
        if(start !== 'start'){
            start.target.disabled = 'true';
            setTimeout( () => start.target.removeAttribute('disabled'), `${this.props.time}900`);
        }
        const room = this.state.room;
        const from = this.state.name;
        const questNum = this.state.questNum;
        var message = {type:'cleanNext', data:questNum};
        await this.socket.emit('msg', { message, room, from});
        message.type = start === 'start' ? 'start' : 'next';
        this.socket.emit('msg', { message, room, from});
        this.setState({questNum: questNum+1})
    }
    
    start = (e) => {
        e.target.disabled = 'true';
        setTimeout( () => e.target.removeAttribute('disabled'), `${this.props.time}900`);
        this.state.start && this.clickNext('start');
        this.setState({start:false})
    }

    listConnected = (list) => {
          this.setState({listConnected: list})
    }

    getListConnected = () => {
        console.log(this.state.listConnected)
        return(
            <div className="listConected">
                <h3>מחוברים כעת {this.state.listConnected.length -1} שחקנים</h3>
                <ol>
                    {this.state.listConnected.map((user, ind) => console.log(user.name) )}
                </ol>
            </div>
        )
    }

    care_socket = (msg) => {
        if(msg[0].type === 'next' && !this.state.next){
            this.props.next(msg[0].data);
            this.setState({next:true})
        } else if(msg[0].type === 'cleanNext'){
            this.setState({next:false})
        } else if(msg[0].type === 'start' && this.state.start){
            this.props.start();
            this.setState({start:false})
        } else if(msg[0].type === 'msg'){
            this.setState({getMsg: msg[0].data, animateWrite:"write"});
            setTimeout(() => this.setState({animateWrite:""}),3000)
        }
    }
    
    render() { 
        if (this.socket) {
            this.socket.on('msg', msg => {
                this.care_socket(msg);
            })
            this.socket.on('getList', list => {
                this.listConnected(list);
            })
        }
        console.log('render');
        return ( 
            <>
                {!this.props.mng && <div className="wrap_msg"><div className="hold_msg"><h1 className={`msg ${this.state.animateWrite}`}>{this.state.getMsg}</h1></div></div>}
                {this.props.mng && 
                    <div>
                        <div>{this.getListConnected()}</div>
                        <input className="form-control col-4 d-inline" name="message" value={this.state.message} onChange={this.handleChange} />
                        <button onClick={this.handleClick} className="btn btn-primary">שלח לכולם</button>
                        <button id="mng_btn" className="btn btn-success d-block m-auto" onClick={this.state.start ? this.start : this.clickNext}>{this.state.start ? 'התחל משחק' : 'לשאלה הבאה'}</button>
                    </div>
                }
            </>
        );
    }
}
 
export default Socket;
import { Component } from "react";
import axios from "axios";
import { apiUrl } from "../config.json";

class Logame extends Component {
    state = { 
        nameGame: '',
        password: '',
        gameId: '',
        status: ''
     }

    inputer = (e) => {
        this.setState({[e.target.name]: e.target.value});
        console.log(this.state);
    }

    sign = () => {
        var self = this;
        var d_game = this.state;
        var data = {params:{
            nameGame: d_game.nameGame,
            password: d_game.password
        }};
        axios.get(`${apiUrl}/games/logame`, data, {
            headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        } )
        .then(function(res){
            console.log(res);
            if(res.data.result === 3){
                self.setState({status:'אחד הפרטים שגוי נסו שוב בבקשה'});
            } else{
                var gameId = res.data.games[0]._id;
                window.location = '/questions?id='+gameId;
            }
        })
    }

    status(){
        return this.state.status;
    }

    render() { 
        return ( 
            <div className="row mt-5">
                <form className="card col-sm-4 p-3 logame_form m-auto text-right">
                    <div className="card-header text-center">
                        <h2 className="card-title">הקישו פרטי משחק</h2>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">שם משחק:</label>
                        <input onChange={this.inputer} name="nameGame" type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">סיסמה:</label>
                        <input onChange={this.inputer} name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="" />
                    </div>
                    
                    <button onClick={this.sign} type="button" className="btn btn-primary">כניסה</button>
                    
                    <div className="status">{this.status()}</div>
                </form>
            </div> 
        );
    }
}
 
export default Logame;
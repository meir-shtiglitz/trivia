import { Component } from "react";
import axios from "axios";
import "../css/admin.css";
import { Link } from "react-router-dom";
import { ApiUrl } from "../api/apiUrl";


class Public_confirm extends Component {
    constructor(){
        super();
        var self = this;
        axios.get(`${ApiUrl}/games/waiting`)
        .then(res => {
            console.log('res');
            console.log(res);
            self.setState({games: res.data});
        })
        
    }
   
    state = {
       id: '',
       games: []
    }

    status = (e) => {
        var self = this;
        var to_update = e.target.name;
        var games = this.state.games;
        var status = e.target.id;
        axios.get(`${ApiUrl}/status/admin`,{
            params:{
                gameId: games[to_update]._id,
                status: status
            }
        })
        .then(res =>{
            console.log(res);
            games.splice(to_update, 1);
            self.setState({games: games});
            
        })    
    }

    

    show_games = () => {
        var games = this.state.games;
        console.log(games);
        if(games.length < 1){ 
            return(
                <div className="text-center position-absolute w-75">
                    <h1 className="m-5">עדיין אין משחקים בהמתנה לאישור</h1>
                </div>
            )
        }

        return(
            
            games.map((game, index) => {
                if(game.name){//&& game.questions
                    var num_q = game.questions.length;
                    var num_p = game.players.length;
                    return(
                        <div className="card text-center mr-1 mb-3 mt-5 col-sm-3" key={game._id}>
                            <div className="card-header">
                                <h3 className="card-title">{game.name}</h3>
                            </div>
                            <div className="card-body">
                                <p>מספר השאלות :{num_q}</p>
                                <p>מספר השחקנים ששיחקו: {num_p}</p>
                                <p>יוצר המשחק: {game.password}</p>
                            </div>
                            <div className="card-footer row">
                                <button name={index} id="public" onClick={this.status} type="button" className="btn btn-primary m-auto col-5">פרסם</button>
                                <button name={index} id="privte" onClick={this.status} type="button" className="btn btn-danger m-auto d-inline col-5">דחה פרסום</button>
                                <div className="text-center col-12">
                                    <Link to={'/questions/' + game._id} className="btn btn-success col-6 mt-3">שחק</Link>
                                </div>
                            </div>
                        </div>
                    )
                } else return null;
            })

        )
    }
  

    render() {
        return ( 
            <div>
                <div style={this.state.displayGames} className="flex">{this.show_games()}</div>
            </div>
         );
    }
}
 
export default Public_confirm;
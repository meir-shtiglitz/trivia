import { Component } from "react";
import axios from "axios";
import "../css/admin.css";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";


class Public_games extends Component {
    constructor(){
        super();
        var self = this;
        axios.get(`${apiUrl}/games/public`)
        .then(res => {
            console.log('res');
            console.log(res);
            self.setState({games: res.data});
            self.setState({loading: ''});
        })
        
    }
   
    state = {
        id: '',
        games: [],
        loading: 'טוען משחקים...'
      }


 

    show_games = () => {
        var games = this.state.games;
        var loading = this.state.loading;
        console.log(games);
        if(games.length < 1 && loading.length < 1){ 
            return(
                <div className="text-center position-absolute w-75">
                    <h1 className="m-5">עדיין אין משחקים באתר</h1>
                </div>
            )
        }

        return(
            
            games.map((game, index) => {
                if(game.name && game.questions.length > 0 && !game.live){//&& game.questions
                    var num_q = game.questions.length;
                    var num_p = game.players.length;
                    return(
                    <div className="card text-center mr-1 p-0 mb-3 mt-5 col-sm-3" key={game._id}>
                        <div className="card-header">
                            <h3 className="card-title">{game.name}</h3>
                        </div>
                        <div className="card-body">
                            <p>מספר השאלות :{num_q}</p>
                            <p>מספר השחקנים ששיחקו: {num_p}</p>
                            <p>יוצר המשחק: {game.password}</p>
                        </div>
                        <div className="card-footer w-100 m-auto row">
                            <Link to={'/questions/' + game._id} className="btn btn-success col-5 m-auto">שחק</Link>
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
                <div className="text-right"><h2>{this.state.loading}</h2></div>
                <div style={this.state.displayGames} className="flex">{this.show_games()}</div>
            </div>
         );
    }
}
 
export default Public_games;
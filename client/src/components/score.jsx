import { Component } from "react";
//import { Questions } from "./questions";
import axios from "axios";
import { apiUrl } from "../config.json";

class Score extends Component {
   
    state = { 
        players: [''], 
        hige_score: {display: "none"}, 
        last_score: ''
    }

    componentDidMount(){
        this.getScore();
        const score = setInterval(() => {
            this.getScore();
        },10000)
        if(!this.props.mng ){ 
            clearInterval(score);
        } else{
            this.hige_score()
        }
    }

    getScore = () => {
        const {gameId} = this.props;
        axios.get(`${apiUrl}/questions/get`,{
            params:{
                gameId: gameId
            }
        })
        .then(res =>{
            console.log('makescore');
            var players = res.data.games[0].players;
            var all_score = players.filter(player => player.points);
            all_score.sort(function(a, b){return b.points - a.points})
            const {questNum} = this.props;
            var last_score = players.filter(player => (player.q_over[questNum] -5) > 0);
            last_score.sort(function(a, b){return b.q_over[questNum] - a.q_over[questNum]})
            console.log(last_score)
            this.setState({players:all_score, last_score: last_score});
        })
    }

    hige_score = () => {
        const {hige_score} = this.state;
        if(hige_score.display === 'none'){
            this.setState({hige_score:{display: 'block'}});
        } else{
            this.setState({hige_score:{display: 'none'}});
        }
    }

    makeTable = (list, from) => {
        if(!list) return;
        const self = this;
        var {limit} = this.props;
        return(
            <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">מקום</th>
                            <th scope="col">שם</th>
                            <th scope="col">{from === 'last' ? 'שניות' : 'נקודות'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(function(player, ind){
                            if(ind > limit) return;
                            if(!player.name) return;
                            if(!self.props.mng && player.finish !== true) return;
                            return (
                                <tr key={ind}>
                                    <td>{ind+1}</td>
                                    <td>{player.name}</td>
                                    <td>{from === 'last' ? Math.ceil(self.props.time - (player.q_over[self.props.questNum] - 5) / 0.0001) : Math.floor(player.points)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
            </table>
        )
    }    

    render() {
        if(!this.state.players) return;
       
        return (
            <div>
                {!this.props.mng && <button onClick={this.hige_score} className="btn btn-success pl-4 pr-4 mb-3">  הצג שיאנים </button>}
                <div style={this.state.hige_score} className="the_table">{this.makeTable(this.state.players)}</div> 
                {this.props.mng && <div className="the_table table_last"><h3>שיאני השאלה הנוכחית</h3>{this.makeTable(this.state.last_score, 'last')}</div> }
            </div> 
    );
    }
}
 
export default Score;
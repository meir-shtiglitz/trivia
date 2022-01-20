
import axios from "axios";
import React, { Component } from "react";
import Questions from "./questions";
import Score from "./score";
import Socket from "./Socket";
import { ApiUrl } from "../api/apiUrl";


class manegQuestions extends Component {
    state = { 
        questNum: 0
    }



    next = () => {
        this.setState({questNum: this.state.questNum+1});
    }

    reset = () => {
        if(window.confirm('בטוח שברצונך לאפס את המשחק? כל השחקנים והתוצאות יימחקו')){
            const { gameId } = this.props.match.params;
            localStorage.setItem(gameId, 'מנהל המשחק');
            axios.get(`${ApiUrl}/game/update`,{
                params:{
                    gameId: gameId,
                    players: [{name: 'מנהל המשחק'}],
                    action: 'reset'
                }
            })
            .then(res => window.location.reload() )
        }
    }

    render() { 
        const gameId = this.props.match.params.gameId;
        const time = parseInt(this.props.match.params.time);
        return ( 
            <>
                <button onClick={this.reset} className="btn btn-danger">אפס נתוני משחק</button>
                <Score gameId={gameId} time={time} mng={true} limit={9} questNum={this.state.questNum} />
                <Socket room={gameId} mng={true} start={this.next} time={time} next={this.next} />
                <Questions gameId={gameId} mng={true} />
            </>
         );
    }
}
 
export default manegQuestions;
 

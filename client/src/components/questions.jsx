
import React, { Component } from "react";
import "./questions.css";
import Score from "./score";
import Counter from './Counter';
import Socket from "./Socket";
import TheQuestion from "./theQuestion";
import { getGame, updateAnswer } from "../api/questions";
import { clickNext, getPlayerDetails, getPlayerName } from "../controlers/Cquestions";

class Questions extends Component {
    constructor(props){
        super(props);
        var gameId = props.match ? props.match.params.gameId : props.gameId;
        this.state = { 
            gameId: gameId,//האיידי של המשחק
            pName: '',//פרטי השחקן(שם)
            points: 0,//נקודות
            q_over: [],//שאלות שכבר ענה עליהם ולא יכול לקבל נקודות
            questions : null,//כל השאלות
            classAfter: '',//קלאס שנותן את התשובות בצבעים לאחר שהשחקן ענה
            questionNum: 0,//מספר השאלה שהשחקן נמצא
            is_player: false,//משתנה לבדיקה האם השחקן קיים או ליצור אותו
            status: false,//האם השחקן כבר סיים את המשחק בעבר
            refresh_score: 0,
            stop: true, //אופרטור לקומפוננט Count האם לעצור או להתחיל
            time: 0, //הזמן שלקח לשחקן לענות
            countime: '',//הזמן בקאונטר
            live: false,//האם המשחק לייב או רגיל
            start: false,//האם המשחק התחיל או לא
        }
        //בדיקה בלוקאל סטורג' אם השחקן קיים
        const pName = localStorage.getItem(gameId);
        if(pName) this.state.pName = pName;
    }

//שאיבת שאלות ושחקנים של המשחק
componentDidMount(){
    const playerAndThenQuestion = async() => {
            const game = await getGame(this.state.gameId, this.updateState);
            await this.get_player(game.players);
            !this.state.live && this.get_qustion();
    }
    playerAndThenQuestion();
}

// בדיקה אם השחקן שיחק כבר והאם סיים ובמידה ולא אז נכניס אותו למערכת באמצעות קריאה לאינסרט פלייר
get_player = async(players) => {
    await this.player_d();
    this.stop();
    var { pName } = this.state;
    getPlayerDetails(players,pName,this.stop,this.updateState);
 }

// עדכון חלק מהסטייט בלי לפגוע בשאר הנתונים
 updateState = (data) =>{
    this.setState({...data})
 }

//'קבלת שם מהשחקן שלא קיים בלוקאל סטורג
   player_d = async() => {
        getPlayerName(this.state.gameId, this.updateState, !this.state.live && this.stop);
   }

//לאחר עניית תשובה
handleAnswer = async (e = false) => {
    await this.stop();
    let answer = true;
    if(!e || e === 'less' || e.target.className === 'afalse') answer = false;
    updateAnswer(this.state, answer, this.updateState, e);
}

next = (qNum) => {
    if(!this.state.stop) return this.handleAnswer('less');//לא הקיש תשובה
    clickNext(this.state, qNum, this.updateState, this.get_qustion);
}
// get the current question
get_qustion = async() => {
    if (!this.state.questions) return;
    this.setState({start: true})
    this.stop();
}

// מטודות קאונטר
stop = () => {
    this.updateState({stop: !this.state.stop})
}

onstop = (time) => {
    this.setState({time:time,stop:true});
    time === 0 &&  this.handleAnswer();
}
// סוף מטודות קאונטר

    render() {
        const state = this.state;
        if (!state.questions) return <div className="text-center"><h1>{state.questions === false ? 'אין שאלות זמינות במשחק זה' : 'טוען שאלות...'}</h1></div>;
        
        return ( 
            <div>
                {this.state.live && this.state.pName && <Socket name={this.state.pName} room={this.state.gameId} next={this.next} start={this.get_qustion} />}
            
            <div className={`contayner ${!this.state.start && 'none'}`}>
            {!this.state.live && <div style={this.state.hige_score} className="col-sm-3 text-center score">
               <Score gameId={this.state.gameId} key={this.state.refresh_score} limit={4} />
            </div>}
            <h3 className="m-auto text-center mb-3">שאלה מספר: {this.state.questionNum+1} מתוך {state.questions.length}</h3>
            {this.state.countime && <Counter onstop={this.onstop} num={this.state.countime} stop={this.state.stop} />}
                <div className="row mt-3"><TheQuestion key={state.questionNum} handleAnswer={this.handleAnswer} next={this.next} mng={this.props.mng} live={state.live} classAfter={state.classAfter} quest={state.questions[state.questionNum]} /></div>
            </div>
        </div>
         );
    }
}
 
export default Questions;

// total rows before fixing 281
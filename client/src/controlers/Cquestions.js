import SAlert from "./SAlert"
import Swal from "sweetalert2";


export const getPlayerName = (gameId, updateState, stopFun) => {
    Swal.fire({
        title: 'לפני שמתחילים בואו נעשה הכרות',
        html: `<div className="text-right"><p >שם:</p></div><input type="text" id="login" className="swal2-input text-right" placeholder="">`,
        confirmButtonText: 'המשך למשחק',
        focusConfirm: false,
        preConfirm: () => {
        const login = Swal.getPopup().querySelector('#login').value
        if (!login) {
            Swal.showValidationMessage(`נא לכתוב שם`)
        }
        return { login: login}
        }
    }).then((result) => {
        console.log("result from player details model",result)
        if(!result.value) return getPlayerName(gameId,updateState);
        result.value.login && localStorage.setItem(gameId, result.value.login);
        updateState({pName:result.value.login})
        stopFun && stopFun();
    })
}

export const getPlayerDetails = (players, player_d, stopFun,updateState) => {
    let playerDetails = {};
    players.map(player => {
        if (!player.name) return;
        if (player.name === player_d){
            const title = `שלום ${player_d}`;
            const c_b_text = 'המשך למשחק';
            const ic_html = '&#9787;';
            playerDetails = {status: player.finish, q_over: player.q_over, is_player: true};
            if(player.q_over.length > 0 && player.finish !== true){
                let text =  'נראה שאתה באמצע משחק,\nאז בא נמשיך מהשאלה שהיית בה,\nעד כה צברת ' + Math.floor(player.points) + ' נקודות';
                playerDetails = {...playerDetails, points: player.points, questionNum: player.q_over.length};
                SAlert (title, text, '', 'question', stopFun, ic_html, c_b_text);
            }
            if(player.finish === true){
                let text = `נראה שכבר סיימת את המשחק הזה, ואפילו צברת ${Math.floor(player.points)} נקודות, תוכל כמובן לשחק שוב אך הנקודות הפעם לא ייצברו לזכותך`;
                SAlert (title, text, '', 'question', stopFun, ic_html, c_b_text);
            }
        } 
    })
    console.log("playerDetails from model",playerDetails)
    updateState(playerDetails);
}

export const clickNext = async(state, qNum, updateState, get_qustion) => {
    let {questions,questionNum, live} = state;
    if (questionNum < questions.length-1){
        questionNum++;
        !isNaN(qNum) && (questionNum = qNum);//במשחק לייב
        await updateState({questionNum: questionNum, classAfter: ''})
        get_qustion()
    } 
    if (questionNum === questions.length-1 && !live){
        document.getElementById("next").style.display = "none";
    }   
}

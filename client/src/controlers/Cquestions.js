import SAlert from "./SAlert"
import Swal from "sweetalert2";

export const isUsernameExist = (username, players) => {
    const isPlayer = players?.filter(p => p.name === username)
    console.log('isPlayer', isPlayer)
    return isPlayer.length
}

export const getPlayerName = async (gameId, updateState, startCounter, players) => {
    let title = 'לפני שמתחילים בואו נעשה הכרות'
    const requiredMessage = `נא לכתוב שם`
    const usernameExistMessage = `שם משתמש תפוס אנא נסה שם אחר`

    return new Promise((resolve, reject) => {
        Swal.fire({
        title,
        html: `<div className="text-right"><p >שם:</p></div><input type="text" id="login" className="swal2-input text-right" placeholder="">`,
        confirmButtonText: 'המשך למשחק',
        focusConfirm: false,
        preConfirm: () => {
        const login = Swal.getPopup().querySelector('#login').value
        if (!login) {
            Swal.showValidationMessage(requiredMessage)
        }
        if (isUsernameExist(login, players)) {
            Swal.showValidationMessage(usernameExistMessage)
        }
        return { login: login}
        }
        }).then(async(result) => {
            console.log("result from player details model",result)
            if(!result.value) return await getPlayerName(gameId,updateState);
            if(isUsernameExist(result.value.login, players)) return await getPlayerName(gameId,updateState);
            result.value.login && localStorage.setItem(gameId, result.value.login);
            updateState({pName: result.value.login})
            startCounter && startCounter();
            resolve(result.value.login)
        })
    })
}

export const getPlayerDetails = async (players, player_d, startCounter, updateState) => {
    return new Promise((resolve, reject) => {
        try {
            const resolveFunc =  () => resolve(() => startCounter())
            let playerDetails = {};
            let isExistPlayer;
            players.forEach( player => {
                if (!player.name) return;
                if (player.name === player_d) {
                    isExistPlayer = true
                    const title = `שלום ${player_d}`;
                    const c_b_text = 'המשך למשחק';
                    const ic_html = '&#9787;';
                    playerDetails = { status: player.finish, q_over: player.q_over, is_player: true };
                    if (player.q_over.length > 0 && player.finish !== true) {
                        let text = `נראה שאתה באמצע משחק,\nאז בא נמשיך מהשאלה שהיית בה,\nעד כה צברת ${Math.floor(player.points)} נקודות`;
                        playerDetails = { ...playerDetails, points: player.points, questionNum: player.q_over.length };
                        SAlert(title, text, '', 'question', resolveFunc, ic_html, c_b_text);
                    }
                    if (player.finish === true) {
                        let text = `נראה שכבר סיימת את המשחק הזה, ואפילו צברת ${Math.floor(player.points)} נקודות, תוכל כמובן לשחק שוב אך הנקודות הפעם לא ייצברו לזכותך`;
                        SAlert(title, text, '', 'question', resolveFunc, ic_html, c_b_text);
                    }
                }
            });
            updateState(playerDetails);
            if(!isExistPlayer) resolveFunc()
            console.log("playerDetails from model", playerDetails);
        } catch (error) {
            reject(error);
        }
    });
};


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

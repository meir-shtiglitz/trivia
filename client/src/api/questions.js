import { ApiUrl } from "./apiUrl";
import axios from "axios";
import SAlert from "../controlers/SAlert";

export const getGame = async (gameId, updateState, fromEdit) => {
    const res = await axios.get(`${ApiUrl}/questions/get`, {
        params: {
            gameId: gameId
        }
    })

    if (!res.data.games) return updateState({ questions: false });
    const game = res.data.games[0];
    const questionNow = game.questions[0] ? { new_q: game.questions[0] } : {};
    const stateUpdate = fromEdit ? { gameId: gameId, ...questionNow } : { countime: game.time, live: game.live };
    updateState({ questions: game.questions, ...stateUpdate });
    return game;
}

export const insertNewPlayer = (gameId, name, updateState) => {
    axios.get(`${ApiUrl}/player/new`, {
        params: {
            gameId: gameId,
            name: name,
            points: 0,
            finish: false,
            q_over: []
        }
    }).then(() => updateState({ is_player: true }))
}

export const updateAnswer = async (state, answer, updateState, e) => {
    let { questionNum, questions, is_player, time, status, q_over, points, gameId, pName } = state;
    //הכנסת שחקן חדש למערכת
    if (!is_player) await insertNewPlayer(gameId, pName, updateState);

    const after_alert = () => {
        !answer && e && e !== 'less' && (e.target.className += " red");
        if (questionNum === questions.length - 1) {
            // סיום המשחק
            finish_game(gameId, pName, points, status, updateState);
        }
    }
    if (!answer) {
        q_over.push(0);
        let title = e ? ' אופס תשובה לא נכונה' : 'נגמר הזמן';
        e === 'less' && (title = 'לא הוקשה תשובה');
        SAlert(title, '', '', 'error', after_alert);
    } else {
        points = points + 5 + (time * 0.0001);
        q_over.push(5 + (time * 0.0001));
        let title = ' יפה מאד תשובה נכונה';
        let text = 'יש לך ' + Math.floor(points) + ' נקודות';
        SAlert(title, text, '', 'success', after_alert);
    }

    if (!status) {
        axios.get(`${ApiUrl}/points/set`, {
            params: {
                gameId: gameId,
                name: pName,
                points: points,
                q_over: q_over
            }
        })
    }
    updateState({ classAfter: 'show_colors', points: points, q_over: q_over })
}


//סיום המשחק
export const finish_game = (gameId, name, points, status, updateState) => {
    if (!status) {
        axios.get(`${ApiUrl}/finish`, {
            params: {
                gameId: gameId,
                name: name,
            }
        })
            .then(res => {
                updateState({ refresh_score: '1' });
            })
    }
    let title = 'סיימת את המשחק';
    let text = `הניקוד שלך הוא: ${Math.floor(points)} נקודות`;
    SAlert(title, text, '', 'success', '', '&#9819');

    const mng_btn = document.getElementById('mng_btn');
    if (mng_btn) mng_btn.style.display = 'none';
}
import axios from "axios";
import swal from "sweetalert2";
import { ApiUrl } from "./apiUrl";


export const updateQuestion = (state, qId, updateState) => {
    let { new_q, gameId, q_num, questions } = state;
    if (!new_q.q || !new_q.atrue || !new_q.afalse1 || !new_q.afalse2 || !new_q.afalse3) {
        return alert('יש למלא את כל השדות');
    }
    new_q.gameId = gameId;
    new_q.q_num = q_num;
    new_q.qId = qId;
    axios.get(`${ApiUrl}/questions/update`, { params: new_q }, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
        .then(function (res) {
            swal.fire({
                title: 'שאלה עודכנה בהצלחה',
                icon: 'success'
            })
            questions[q_num] = new_q;
            updateState({ questions: questions });
        })
}


export const deleteQuestion = (state, qId, updateState, back) => {
    var { gameId, questions } = state;
    swal.fire({
        title: 'בטוח שברצונך למחוק את השאלה',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'אישור',
        cancelButtonText: 'ביטול',
    }).then(res => {
        if (res.isConfirmed === false) {
            return
        } else {
            var params = {
                gameId: gameId,
                qId: qId
            }
            axios.get(`${ApiUrl}/questions/delete`, { params: params }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
                .then(function (res) {
                    var filter_q = questions.filter(q => q._id !== qId);
                    updateState({ questions: filter_q })
                    back();
                })
        }
    })
}

export const addQuestion = (state, updateState) => {
    var { new_q, gameId } = state;
    if (!new_q.q || !new_q.atrue || !new_q.afalse1 || !new_q.afalse2 || !new_q.afalse3) {
        return alert('יש למלא את כל השדות');
    }
    new_q.gameId = gameId;
    axios.get(`${ApiUrl}/questions/new`, { params: new_q }, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
        .then(function (res) {
            swal.fire({
                title: 'שאלה נוספה בהצלחה',
                icon: 'success'
            })
            var callback = res.data.games[0].questions;
            updateState({ questions: callback, q_num: callback.length - 1, new_q: callback[callback.length - 1], arowRight: callback.length > 1, arowLeft: false, updateStatus: true });
        })
}
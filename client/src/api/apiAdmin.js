import axios from "axios";
import swal from "sweetalert2";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ApiUrl } from "./apiUrl";

export const getAdminGames = (updateState) => {
    let user = localStorage.getItem("user");
    if (!user) return window.location = "/login";

    user = jwt_decode(user);
    axios.get(`${ApiUrl}/games/get`, {
        params: {
            id: user.id
        }
    })
        .then(res => {
            console.log('res from admin api', res);
            if (res.data.length > 0) {
                updateState({ id: user.id, games: res.data[0].games, loading: '' });
            }
        })
}

export const saveGame = (state, updateState) => {
    const { id, name_game, password, status, time, live } = state;
    var data = {
        params: {
            id, password, status, time,
            name: name_game,
            live: (live === true),
            action: 'user'

        }
    };
    console.log(data);
    axios.get(`${ApiUrl}/game/new`, data, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
        .then(function (res) {
            updateState({ games: res.data.games, displayForm: false });
            // if(res.data.result == 3){
            //     self.setState({status:'שם משחק כזה כבר קיים במערכת נסה שם אחר'});
            // } else{
            //     var user = {id: callback._id, name: details.name, email: details.email, phone: details.phone, password: details.password};
            //      user = JSON.stringify(user);
            //     console.log(user);
            //     localStorage.setItem("user", user);
            //     self.props.history.push('/');
            // }
        })
}
export const updateGame = (state, to_update, updateState) => {
    let { games, name_game, password, status, time, live } = state;
    axios.get(`${ApiUrl}/game/update`, {
        params: {
            gameId: games[to_update]._id,
            name: name_game,
            password, status, live, time,
            action: 'user'
        }
    })
        .then(res => {
            games[to_update].name = name_game;
            games[to_update].password = password;
            if (status === 'public') status = 'waiting';
            games[to_update].status = status;
            games[to_update].live = live;
            games[to_update].time = time;
            updateState({ games: games, displayForm: false, editGame: false });
        })
}

export const deleteGame = (gameId, updateState) => {
    swal.fire({
        title: 'בטוח שברצונך למחוק את המשחק ואת כל השאלות',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'אישור',
        cancelButtonText: 'ביטול',
    }).then(res => {
        if (res.isConfirmed === false) {
            return;
        } else {
            axios.get(`${ApiUrl}/game/delete`, {
                params: {
                    gameId: gameId,
                }
            })
                .then(res => {
                    updateState({ games: res.data.games });
                })
        }
    })
}
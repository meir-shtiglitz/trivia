import { Component } from "react";
import { Link } from "react-router-dom";

class AdminGame extends Component {

    copyLink = (e) => {
        const link = e.target.id
        navigator.clipboard.writeText(link);
        e.target.previousSibling.style.display = 'block';
        setTimeout(function () {
            e.target.previousSibling.style.display = 'none';
        }, 1000)
    }

    render() {
        const { game, index, edit, deleteGame } = this.props;
        const num_q = game.questions.length;
        const num_p = game.players.length;
        var status = 'פרטי';
        if (game.status === 'public') status = 'ציבורי';
        if (game.status === 'waiting') status = 'מחכה לאישור';
        var link = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/questions/' + game._id;
        return (
            <div className="card text-center mr-1 mb-3 p-0 col-sm-4" key={game._id}>
                <button onClick={() => edit(index)} className="btn btn primary-outline edit_general"><i className="fas fa-pencil-alt"></i></button>
                <div className="card-header">
                    <h3 className="card-title">{game.name}</h3>
                </div>
                <div className="card-body">
                    <p>מספר השאלות :{num_q}</p>
                    <p> מספר השחקנים ששיחקו :{num_p}</p>
                    <p>סיסמת המשחק :{game.password}</p>
                    <p>סטטוס משחק: {status}</p>
                    <div className="link_msg">הקישור הועתק</div>
                    <button id={link} onClick={this.copyLink} className="btn btn-success-outline text-success">העתקת קישור למשחק</button>
                    {game.live && <Link to={`/mng/${game._id}/${game.time}`} className="btn btn-success-outline text-success">ניהול משחק לייב</Link>}
                </div>
                <div className="card-footer w-100 m-auto row">
                    <Link to={'edit?id=' + game._id} className="btn btn-success col-5 m-auto">ערוך שאלות</Link>
                    <button onClick={() => deleteGame(game._id)} className="btn btn-danger col-5 m-auto">מחק משחק</button>
                </div>
            </div>
        )
    }
}

export default AdminGame;
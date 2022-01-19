import { Component } from "react";
import "../css/admin.css";
import { deleteGame, getAdminGames, saveGame, updateGame } from "../api/apiAdmin";
import { editInputVal } from "../controlers/Cadmin";
import AdminGame from "./admin.game";
import AdminFormGame from "./admin.formGame";

class Admin extends Component {
    state = {
        user: '',
        id: '',
        games: [],
        name_game: '',
        password: '',
        update_name: '',
        update_password: '',
        status: '',
        time: 0,
        live: false,
        displayForm: false,
        editGame: false,
        msg: '',
        loading: 'טוען משחקים...'
    }

    componentDidMount() {
        getAdminGames(this.updateState);
    }

    updateState = (data) => {
        this.setState({ ...data })
    }

    showForm = () => {
        this.setState({ displayForm: true, editGame: false, name_game: '', password: '', status: '', time: 0, live: false });
    }

    clicker = async (e) => {
        editInputVal(this.state.live, this.state.status, this.updateState, e.target);
    }

    save = () => {
        saveGame(this.state, this.updateState);
    }

    show_games = () => {
        const { games, loading } = this.state;
        if (games.length < 1 && loading.length < 1) {
            return (
                <div className="text-center col-12">
                    <h1 className="m-5">עדיין אין לך משחקים משלך</h1>
                    <button onClick={this.showForm} className="btn btn-success mb-3">צור משחק חדש</button>
                </div>
            )
        }
        return (
            games.map((game, index) => {
                return game.name ? <AdminGame game={game} index={index} edit={this.edit} deleteGame={this.delete} />
                    : null;
            })
        )
    }
    to_update = '';
    edit = (index) => {
        const game = this.state.games[index]
        this.to_update = index;
        this.setState({ name_game: game.name, password: game.password, status: game.status, time: game.time, live: game.live, displayForm: true, editGame: true });
    }

    checked = (status) => {
        if (status === this.state.status) return 'checked';
    }

    checked_waiting = (status) => {
        if (status === this.state.status) return 'מחכה לאישור פרסום';
    }

    update = () => {
        updateGame(this.state, this.to_update, this.updateState);
    }

    delete = (gameId) => {
        deleteGame(gameId, this.updateState);
    }

    cancel = () => {
        this.setState({ displayForm: false, editGame: false });
    }

    render() {
        const { displayForm } = this.state;
        return (
            <div>
                <AdminFormGame state={this.state} clicker={this.clicker} showForm={this.showForm} checked={this.checked} checked_waiting={this.checked_waiting} update={this.update} save={this.save} cancel={this.cancel} />
                {!displayForm && <div className='flex'>{this.show_games()}</div>}
            </div>
        );
    }
}
export default Admin;

// total rows before fixsing 355
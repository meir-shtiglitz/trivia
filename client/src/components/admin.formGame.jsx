import { Component } from "react";
import Inputs from "./inputs"

class AdminFormGame extends Component {

    inputCreator = (name, label) => {
        const { state, clicker } = this.props;
        return <Inputs key={name} name={name} label={label} value={state[name]} change={clicker} />
    }
    render() {
        const { state, clicker, showForm, checked, checked_waiting, update, save, cancel } = this.props;
        const { displayForm, editGame, loading, live, time, msg } = state;
        return <div>
            <div>
                <button onClick={showForm} className="btn btn-success mb-3">צור משחק חדש</button>
            </div>
            <div className="text-right"><h2>{loading}</h2></div>
            {displayForm && <div>
                <form className="card m-auto p-3 col-sm-4 text-right">
                    <div className="card-header text-center">
                        <h2 className="card-title">{editGame ? 'עדכן משחק' : 'משחק חדש'}</h2>
                    </div>
                    {this.inputCreator('name_game', 'שם המשחק')}
                    {this.inputCreator('password', 'סיסמה')}
                    <div className="form-group row">
                        <label className="live col-6 text-center">
                            <span>משחק לייב / רגיל:</span>
                            <br />
                            <input onChange={clicker} value={live} checked={live} type="checkbox" name="live" />
                            {/* אנימציה לייב */}
                            {live ? <div class="livenow">
                                <div>לייב</div>
                            </div> :
                                <div class="regular">
                                    <div>רגיל</div>
                                </div>}
                        </label>
                        {/* choose time for answer  */}
                        <label className="col-6 text-center">
                            <span>הגבלת זמן לתשובות:</span>
                            <br />
                            <select value={time} onChange={clicker} name="time" id="">
                                <option value={0}>ללא</option>
                                {[15, 30, 45, 60].map(num => <option value={num}>{num}</option>)}
                            </select>
                        </label>
                    </div>
                    <hr />
                    {/* סטטוס משחק פרטי או ציבורי */}
                    <div className="form-group row">
                        <label className="status">
                            <input onChange={clicker} value="public" checked={checked('public')} type="radio" name="status" />
                            <i className="fas fa-check-circle vi"></i>
                            <i className="fas fa-lock-open manul"></i>
                            <span>ציבורי</span>
                        </label>
                        <label className="status">
                            <input onChange={clicker} value="privte" checked={checked('privte')} type="radio" name="status" />
                            <i className="fas fa-check-circle vi"></i>
                            <i className="fas fa-lock manul"></i>
                            <span>פרטי</span>
                        </label>
                    </div>

                    <p className="text-center">{checked_waiting('waiting')}</p>
                    <div className="form-group row">
                        <button onClick={editGame ? update : save} type="button" className="btn btn-primary m-auto col-5">שמור</button>
                        <button onClick={cancel} type="button" className="btn btn-danger m-auto d-inline col-5">ביטול</button>
                    </div>

                    <div className="msg">{msg}</div>
                </form>
            </div>}
        </div>;
    }
}

export default AdminFormGame;
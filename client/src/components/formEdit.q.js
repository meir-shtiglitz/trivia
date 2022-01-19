import Inputs from "./inputs"
import { Component } from "react";

class FormEditQ extends Component {

    inputCreator = (name, label) => {
        const { new_q } = this.props.state;
        const { inputer } = this.props;

        return <Inputs key={name} name={name} label={label} value={new_q[name]} change={inputer} />
    }

    render() {
        const { state, next, back, update, save, cancel, deleteQ } = this.props;
        const { q_num, questions, arowLeft, updateStatus, new_q, arowRight, status } = state;
        const directive = updateStatus ? 'עדכנו' : 'הזינו';
        return (<>
            {updateStatus && <h3 className="m-auto text-center">שאלה מספר: {q_num + 1} מתוך {questions.length}</h3>}

            <div className="row text-center">
                <form className="card p-3 m-auto text-right col-sm-4">
                    <div className="card-header">
                        {this.inputCreator('q', `${directive} שאלה`)}
                    </div>
                    {[{ name: 'atrue', label: `${directive} תשובה נכונה` }, { name: 'afalse1', label: `${directive} תשובה לא נכונה` }, { name: 'afalse2', label: `${directive} תשובה לא נכונה` }, { name: 'afalse3', label: `${directive} תשובה לא נכונה` }].map((answer) => this.inputCreator(answer.name, answer.label))}
                    <div className="text-center card-footer row">
                        <button id={new_q._id} onClick={(e) => updateStatus ? update(e) : save(e)} type="button" className="btn btn-primary col-5 m-auto m-3">{updateStatus ? 'עידכון' : 'הוספה'}</button>
                        <button id={new_q._id} onClick={(e) => updateStatus ? deleteQ(e) : cancel(e)} type="button" className="btn btn-danger m-3 col-5 m-auto">{updateStatus ? 'מחיקה' : 'ביטול'}</button>
                    </div>
                    <div>{status}</div>
                    {updateStatus && <>
                        {arowLeft && <div onClick={next} className="arrow_left">
                            <p><i className="fas fa-chevron-left"></i></p>
                        </div>}
                        {arowRight && <div onClick={back} className="arrow_right">
                            <p><i className="fas fa-chevron-right"></i></p>
                        </div>}</>}
                </form>
            </div>
        </>)
    }
}

export default FormEditQ;
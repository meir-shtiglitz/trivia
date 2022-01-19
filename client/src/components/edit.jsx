import { Component } from "react";
import "./edit.css";
import { getGame } from "../api/questions";
import { getBack, getNext } from "../controlers/Cedit";
import { addQuestion, deleteQuestion, updateQuestion } from "../api/apiEdit";
import FormEditQ from "./formEdit.q";

class Edit extends Component {
    initNewQ = () => ({ q: '', atrue: '', afalse1: '', afalse2: '', afalse3: '' });

    state = {
        gameId: '',
        questions: [],
        q_num: 0,
        updateStatus: true,
        arowLeft: true,
        arowRight: false,
        new_q: this.initNewQ()
    }

    componentDidMount() {
        var gameId = window.location.search.split("=")[1];
        getGame(gameId, this.updateState, true);
    }

    updateState = (data) => {
        this.setState({ ...data })
    }

    formQuestions = () => {
        var q_now = this.state.questions[this.state.q_num];
        var { updateStatus } = this.state;
        return (
            <>
                {!q_now && <div className="text-center">
                    <h1 className="m-5">עדיין אין שאלות במשחק</h1>
                    <button onClick={this.show} className="btn btn-success">הוספת שאלה</button>
                </div>}
                {(!updateStatus || q_now) && <div>
                    <FormEditQ state={this.state} next={this.next} back={this.back} inputer={this.inputer} update={this.update} save={this.save} cancel={this.cancel} deleteQ={this.delete} />
                </div>}
            </>
        )
    }

    next = () => {
        const { q_num, questions } = this.state;
        getNext(q_num, questions, this.updateState)
    }

    back = () => {
        const { q_num, questions } = this.state;
        getBack(q_num, questions, this.updateState)
    }

    show = () => {
        this.updateState({ updateStatus: false, q_num: 0, new_q: this.initNewQ() });
    }

    inputer = (e) => {
        this.setState(prevState => ({
            new_q: {
                ...prevState.new_q,
                [e.target.name]: e.target.value
            }
        }))
    }

    update = (e) => {
        updateQuestion(this.state, e.target.id, this.updateState);
    }

    delete = (e) => {
        deleteQuestion(this.state, e.target.id, this.updateState, this.back);
    }

    save = () => {
        addQuestion(this.state, this.updateState)
    }

    cancel = () => {
        this.setState({ updateStatus: true, new_q: this.state.questions[0] });
    }

    render() {
        return (
            <div>
                <div><button onClick={this.show} className="btn btn-success">הוספת שאלה</button></div>
                <div>{this.formQuestions()}</div>
            </div>
        );
    }
}

export default Edit;

// total rows before fixing 300
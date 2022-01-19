import {Component} from 'react';

class TheQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = { answers: null }
    }

    componentDidMount(){
       this.shuffle(this.props.quest);
    }

    shuffle = (item) => {
        var answersShuffle = [];
        var answers = [
            {class:"atrue", value: item.atrue},
            {class:"afalse", value: item.afalse1},
            {class:"afalse", value: item.afalse2}, 
            {class:"afalse", value: item.afalse3}
        ];
        
        for (let spam = 0; spam < 4; spam++){
            var rand = Math.floor(Math.random() * answers.length);
            answersShuffle.push(answers[rand]);
            answers.splice(rand, 1);
        }
        return(
            this.setState({answers: answersShuffle})
        )
    }


    render() { 
        if(!this.state.answers) return(<span></span>);
        return ( 
            <div className="card text-center m-auto p-0 col-sm-4" id="card_trivia">
                <div className="card-header">
                    <h3 id="title">{this.props.quest.q}</h3>
                </div>
                <div id="answers" className={`card-body ${this.props.mng && 'show_colors'} ` + this.props.classAfter}>
                    {this.state.answers.map(answer => <p onClick={this.props.handleAnswer} className={answer.class} key={answer.value}>{answer.value}</p>)}
                </div>
                <div className="card-footer m-auto w-100">
                    {!this.props.live && <button onClick={this.props.next} id="next" className="btn btn-success pl-4 pr-4"><i className="fas fa-chevron-circle-left"></i>  לשאלה הבאה </button>}
                </div>
            </div>
         );
    }
}
 
export default TheQuestion;
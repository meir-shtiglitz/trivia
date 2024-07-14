import React, { Component } from "react";

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.num,
            stop: this.props.stop
        }
        this.countRender = 0;
    }


    start = (clear = false) => {
        clear ? this.setState({ stop: true }) : this.setState({ stop: false, count: this.props.num });
        var p = setInterval(() => {
            const new_count = this.state.count - 1;
            this.state.stop ? clearInterval(p) :
                this.setState({ count: new_count });
        }, 1000)
    }


    stop = () => {
        this.props.onstop(this.state.count);
        this.setState({ stop: true })
    }

    finish = () => {
        this.props.onstop(0);
        this.start(true);
        this.setState({ count: this.props.num, stop: true })
    }

    // reset=()=>{
    //     this.setState({count: this.props.num, stop:true})
    // }

    render() {
        console.log('this.props.stop', this.props.stop)
        console.log('this.state.stop', this.state.stop)
        if (this.state.stop !== this.props.stop) {
            this.props.stop ? this.stop() : this.start();
        }
        this.state.count < 1 && this.finish();
        return (
            <>
                <h1 className={`text-center ${this.state.count < 6 && 'text-danger'}`}>{this.state.count}</h1>
                {/* <button onClick={()=>this.start()} className="btn btn-success">start</button> */}
                {/* <button onClick={this.stop} className="btn btn-danger">stop</button> */}
                {/* <button onClick={this.reset} className="btn btn-warning">reset</button> */}
            </>
        );
    }
}
export default Counter;
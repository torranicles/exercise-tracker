import React from 'react'
import Login from './Login'
import Register from './Register'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //move to App.js
            viewReg: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleSuccessAuth = this.handleSuccessAuth.bind(this);
    }
    handleSuccessAuth(data) {
        this.props.handleLogin(data);
        this.props.history.push('/dashboard');
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({
            viewReg: !this.state.viewReg
        })
        console.log(this.state)
    }

    componentDidMount() {
        if (this.props.logged_in) {
            this.props.history.push('/dashboard')
        }
    }
    
    render() {
        return (
            <div className="container-fluid">
                <div className="d-flex h-100 p-3 align-items-center">
                    <div className="container-md">
                        <h1 className="head">
                        TRACK YOUR WORKOUT ROUTINE
                        </h1>
                    </div>
                    {
                        !this.state.viewReg
                        ? <Login handleClick={this.handleClick} handleSuccessAuth={this.handleSuccessAuth}/>
                        : <Register handleClick={this.handleClick} handleSuccessAuth={this.handleSuccessAuth}/>
                    }
                </div>
            </div>
        )
    }
}

export default Home;

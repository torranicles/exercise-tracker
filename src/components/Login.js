import React from 'react'
import '../styles/Login.css'
import axios from 'axios'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message: ''
        }
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleSubmit =this.handleSubmit.bind(this);
    }
    handleUserChange(e) {
        this.setState({
            username: e.target.value
        })
    }

    handlePassChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post('/api/login/', this.state)
            .then(res => {
                if (res.data.username === this.state.username) {
                    this.props.handleSuccessAuth(res.data);
                } else {
                    this.setState({
                        message: res.data
                    })
                }
            })
            .catch(err => console.log("Login error", err))
    }

    render() {
        const text ={
            textDecoration: "none",
            fontSize: '1.25rem'
        }
        return (
            <div className="container-md">
                <form onSubmit={this.handleSubmit} className="login">
                    <div className="form-group p-1">
                        <label for="username">Username:</label>
                        <input 
                        onChange={this.handleUserChange} 
                        type="text" 
                        className="form-control" 
                        name="username"/>
                    </div>
                    <div className="form-group p-1">
                        <label for="password">Password:</label>
                        <input 
                            onChange={this.handlePassChange} 
                            type="password" 
                            className="form-control" 
                            name="password"/>
                    </div>
                    <span className="float-right text-danger">
                        {this.state.message}
                    </span>
                    <br/>
                    <br/>
                    <div className="text-center">
                        <button className="btn btn-outline-light" type="submit">Submit</button>
                    </div>
                    <br/>
                    <div className="text-center">
                        Don't have an account? 
                        <button className="btn btn-link" style={text} onClick={this.props.handleClick}>
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        )
    }
  }
  
  export default Login;
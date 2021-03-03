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
            username: e.target.value,
            message: ''
        })
    }

    handlePassChange(e) {
        this.setState({
            password: e.target.value,
            message: ''
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
            <div className="container-md p-0">
                <form onSubmit={this.handleSubmit} className="login">
                    <h1 className="text-center">Login</h1>
                    <div className="form-group p-1">
                        <label for="username">Username:</label>
                        <input 
                        onChange={this.handleUserChange} 
                        type="text" 
                        className="form-control" 
                        name="username"/>
                    </div>
                    <div className="form-group p-1 mb-2">
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
                    <div className="text-center mt-2">
                        <button className="btn btn-outline-light" type="submit">Submit</button>
                    </div>
                    <div className="text-center mx-1 mt-3">
                        <a href="http://localhost:5000/auth/github" className="text-decoration-none btn btn-outline-light w-100">
                            Sign in with Github <i className="fab fa-github ml-2"/>
                        </a>
                    </div>
                    <br/>
                    <div className="text-center">
                        Don't have an account? 
                        <span className="signup-btn ml-2" onClick={this.props.handleClick}>
                            Sign up
                        </span>
                    </div>
                </form>
            </div>
        )
    }
  }
  
  export default Login;
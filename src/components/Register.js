import React from 'react'
import axios from 'axios'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
            password: '',
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post('/api/register/', this.state)
            .then(res => {
                console.log(res)
                if (res.data.username == this.state.username) {
                    this.props.handleSuccessAuth(res.data)
                } else {
                    this.setState({
                        message: res.data[0]
                    })
                }
            })
            .catch(err => console.log("Registration error", err))
    }

    render() {
        const back = {
            color:' white',
            fontSize: '2vw'
        }
        return (
            <div className="container-md">
                <form onSubmit={this.handleSubmit} className="login">
                    <h1 className="text-center">Register</h1>
                    <div className="form-group p-1">
                        <label for="first_name">First name:</label>
                        <input type="text" 
                            onChange={this.handleChange} 
                            className="form-control" 
                            name="first_name"
                            required
                        />
                    </div>
                    <div className="form-group p-1">
                        <label for="last_name">Last name:</label>
                        <input type="text" 
                            onChange={this.handleChange} 
                            className="form-control" 
                            name="last_name"
                            required
                        />
                    </div>
                    <div className="form-group p-1">
                        <label for="username">Username:</label>
                        <input type="text" 
                            onChange={this.handleChange} 
                            className="form-control" 
                            name="username"
                            required
                        />
                    </div>
                    <div className="form-group p-1">
                        <label for="password">Password:</label>
                        <input type="password" 
                            onChange={this.handleChange} 
                            className="form-control" 
                            name="password"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-outline-light" type="submit">Submit</button>
                    </div>
                    <br/>
                    <button className="btn btn-link" style={back} onClick={this.props.handleClick}>
                        <i className="fas fa-arrow-left float-left"/>
                    </button>
                    <span className="float-right">
                        {this.state.message}
                    </span>
                </form>
            </div>
        )
    }
}
export default Register;
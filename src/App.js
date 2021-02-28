import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import axios from 'axios'
import ProtectedRoute from './components/protected.route'
import { withRouter } from "react-router"
import Loader from './components/Loader'

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          username: '',
          logged_in: false,
          loading: true
      }
      this.handleLogin = this.handleLogin.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleLogin(data) {
        this.setState({
            username: data.username,
            logged_in: true
        })
        console.log(this.state,"2")
    }

    handleLogout() {
        axios.get('/logout')
            .then(res => {
                if (res.data == "Logged out") {
                    this.setState({
                        logged_in: false
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    checkLoginStatus() {
        axios.get('/logged_in')
            .then(res => {
                if (res.data.logged_in && this.state.logged_in == false) {
                    this.setState({
                        logged_in: true,
                        loading: false
                    });
                } else if (!res.data.logged_in) {
                    this.setState({
                        logged_in: false,
                        loading: false
                    });
                }
            })
            .catch(err => console.log("Login status", err)) //TO DO: Render error message if error is present/exit from load if err
    }

    componentDidMount(){
        this.checkLoginStatus()
    }
    render() {
        return (
            <Router>
                <Switch>
                    {
                        this.state.loading
                        ? <Loader/>
                        : <Route exact path="/" render={props => {
                            return <Home 
                                {...props}
                                logged_in={this.state.logged_in}
                                handleLogin={this.handleLogin}
                            />} 
                        }/>
                    }
                    <ProtectedRoute 
                        handleLogout={this.handleLogout} 
                        logged_in={this.state.logged_in} 
                        path="/dashboard" 
                        component={Dashboard}
                    />
                    </Switch>
            </Router>
        )
    }
}

export default withRouter(App);
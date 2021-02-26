import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import axios from 'axios'
import { ProtectedRoute } from './components/protected.route'

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          username: '',
          logged_in: false
      }
      this.handleLogin = this.handleLogin.bind(this);
    }
    
    handleLogin(data) {
        this.setState({
            username: data.username,
            logged_in: true
        })
        console.log(this.state,"2")
    }
    
    checkLoginStatus() {
        axios.get('/logged_in')
            .then(res => {
                if (res.data.logged_in && this.state.logged_in == false) {
                    this.setState({
                        logged_in: true
                    })
                } else if (!res.data.logged_in) {
                    this.setState({
                        logged_in: false
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
                    <Route exact path="/" render={props => {
                            return <Home 
                            {...props}
                            handleLogin={this.handleLogin}
                            />
                        } 
                    }/>
                    <ProtectedRoute login={this.state.logged_in} path="/dashboard" component={Dashboard}/>
                    </Switch>
            </Router>
        )
    }
}

export default App;
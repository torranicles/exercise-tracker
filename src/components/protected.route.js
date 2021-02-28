import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default class ProtectedRoute extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.logged_in != prevProps) {
            return this.props.logged_in;
        }
    }
    render() {
        const {component: Component, ...rest} = this.props;
        return (
            <Route {...rest}
            render={props => {
                    if (this.props.logged_in) {
                        return <Component {...props} handleLogout={this.props.handleLogout}/>
                    } else { 
                        return (
                            <Redirect to={{
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                                }}
                            />
                            )
                    }
            }}
        />
        )
    }
}
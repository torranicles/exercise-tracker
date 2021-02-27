import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default class ProtectedRoute extends React.Component {

    componentDidUpdate(prevProps) {
        if (this.props.login != prevProps) {
            return this.props.login;
        }
    }
    render() {
        const {component: Component, ...rest} = this.props;
        return (
            <Route {...rest}
            render={props => {
                    if (this.props.login) {
                        return <Component {...props}/>
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
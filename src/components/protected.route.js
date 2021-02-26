import React, { useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import auth from './auth'

export const ProtectedRoute = ({component: Component, login, ...rest}) => {
    return (
        <Route {...rest}
            render={props => {
                    if (login || sessionStorage.getItem('logged_in')) {
                        sessionStorage.setItem('logged_in', true); //set on inital connection
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
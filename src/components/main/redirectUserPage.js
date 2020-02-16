import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class RedirectUserPage extends Component {
    render() {
        
        const id = this.props.match.params.id
        return <Redirect to={{pathname: "/user/" + id, state:{redirect:false}}} />
    }
}

export default RedirectUserPage
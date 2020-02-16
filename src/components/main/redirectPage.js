import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class RedirectPage extends Component {
    render() {
        const id = this.props.match.params.id
            return <Redirect to={"/moment/" + id} />
    }
}

export default RedirectPage
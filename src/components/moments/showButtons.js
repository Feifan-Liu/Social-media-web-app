import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class ShowButtons extends Component {

    handleUpdate = (e) => {
        this.setState({ updated: true });
    }

    handleDelete = (e) => {
        this.setState({ deleted: true });
    }

    render() {
        if (this.state && this.state.updated) {
            return <Redirect to={{ pathname: '/updateMoment/' + this.props.momentId, state: { token: this.props.token } }} />;
        }
        if (this.state && this.state.deleted) {
            return <Redirect to={{ pathname: '/deleteMoment', state: { token: this.props.token, momentId: this.props.momentId } }} />;
        }
        return (
            <div>
                <button className="btn red lighten-1 btn-small right" onClick={() => { this.handleDelete() }}>Delete</button>
                <button className="btn blue lighten-1 btn-small right" onClick={() => { this.handleUpdate() }}>Update</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
      token: state.firebase.profile.token
    }
  }

export default connect(mapStateToProps)(ShowButtons)
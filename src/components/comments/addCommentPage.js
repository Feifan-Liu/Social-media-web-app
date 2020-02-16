import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addComment } from '../../store/actions/commentAction'
import { Redirect } from 'react-router-dom'

class AddCommentPage extends Component {
  state = {
    content: '',
    momentId: this.props.momentId
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  //go to add comment 
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      updated: true
    })
  }
  render() {
    const { commentIsOn, props } = this.props;
    if (this.state && this.state.updated) {
      return <Redirect to={{ pathname: '/addComment', state: { token: this.props.token, comment: this.state } }} />;
    }
    if (commentIsOn) {
      if (props.auth.uid) {
        return (
          <div className="container">
            <form className="white" onSubmit={this.handleSubmit}>
              <div className="comment-field">
                <label htmlFor="content">Comment Content</label>
                <textarea id="content" className="materialize-textarea" onChange={this.handleChange} value={this.state.content}></textarea>
                <button className="btn black lighten-1 z-depth-0">Comment</button>
              </div>
            </form>
          </div>
        )
      } else {
        return (
          <div className="container center">
            <p>Please Log in to comment...</p>
          </div>
        )
      }
    }
    else {
      return (
        <div className="container center">
          <p>Author has switched off comments</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    token: state.firebase.profile.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addComment: (comment, momentId) => dispatch(addComment(comment, momentId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommentPage)

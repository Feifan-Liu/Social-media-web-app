import React, { Component } from 'react'
import moment from 'moment'
import { deleteComment, updateComment } from '../../store/actions/commentAction'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

class CommentSummary extends Component {
  state = {
    id: this.props.commentId,
    content: this.props.comment.content,
    display: 'none'
  }
  handleUpdate = (e) => {
    this.setState({
      updated: true
    })
  };

  handleDelete = (e) => {
    this.setState({
      deleted: true
    })
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  componentDidMount() {
    if (this.props.momentAuthId === this.props.auth.uid) {
      this.setState({
        display: 'inline'
      });
    }
  }



  render() {
    const { tokenFromProfile, comment, auth } = this.props;
    
    if (this.state && this.state.updated) {
      return <Redirect to={{ pathname: '/updateComment', state: { token: tokenFromProfile, comment: this.state, momentId: this.props.comment.momentId } }} />;
    }
    if (this.state && this.state.deleted) {
      return <Redirect to={{ pathname: '/deleteComment', state: { token: tokenFromProfile, commentId: this.props.commentId, momentId: this.props.comment.momentId } }} />;
    }
    if (comment && comment.createdAt) {

      //if comment author id matches user id
      if (comment.authorId !== auth.uid) {
        return (
          <div className="card z-depth-0 momentt-summary">
            <div className="card-content grey-text text-darken-3">
              <span className="card-title ">{comment.content}
                <button id="commentaction" className="btn red lighten-1 btn-small right" style={{ display: this.state.display }} onClick={this.handleDelete}>Delete</button>
              </span>
              <p>Posted by
              <Link className="hoverable" to={'/user/' + comment.authorId}> {comment.authorFirstName} {comment.authorLastName}
                </Link>
              </p>
              <p className="grey-text">{moment(comment.createdAt.toDate()).calendar()}</p>
            </div>
          </div>
        )
      }
      //if comment author id does not matche user id
      else {
        return (
          <div className="card z-depth-0 momentt-summary">
            <div className="card-content grey-text text-darken-3">
              <span className="card-title "><textarea id="content" className="card-title materialize-textarea" onChange={this.handleChange} value={this.state.content}></textarea>
                <button id="commentaction" className="btn red lighten-1 btn-small right" onClick={this.handleDelete}>Delete</button>
                <button id="commentaction" className="btn blue lighten-1 btn-small right" onClick={this.handleUpdate}>Update</button></span>
              <p>Posted by <Link className="hoverable" to={'/user/' + comment.authorId}> {comment.authorFirstName} {comment.authorLastName}
              </Link></p>
              <p className="grey-text">{moment(comment.createdAt.toDate()).calendar()}</p>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div>
          loading...
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteComment: (commentId, momentId) => dispatch(deleteComment(commentId, momentId)),
    updateComment: (comment, momentId) => dispatch(updateComment(comment, momentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentSummary)

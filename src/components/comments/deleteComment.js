import React, { Component } from 'react'
import { deleteComment } from '../../store/actions/commentAction'
import { connect } from 'react-redux'

class DeleteComment extends Component {

  //check token
  componentDidMount() {
    if (this.props.location.state) {
      const { auth, tokenFromProfile } = this.props;
      const { token, commentId, momentId } = this.props.location.state
      if (auth.uid && tokenFromProfile === token) {
        this.props.deleteComment(commentId, momentId);
      }
      this.props.history.push('/moment/' + momentId);
    }
  }

  render() {
    return (<p className = "red-text center">You cannot directly enter this page</p>)
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    tokenFromProfile: state.firebase.profile.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteComment: (comment, momentId) => dispatch(deleteComment(comment, momentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteComment)

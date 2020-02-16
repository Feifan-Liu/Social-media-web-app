import React, { Component } from 'react'
import { updateComment } from '../../store/actions/commentAction'
import { connect } from 'react-redux'

class UpdateComment extends Component {

  //check token
  componentDidMount() {
    if (this.props.location.state) {
      const { auth, tokenFromProfile } = this.props;
      const { token, comment, momentId } = this.props.location.state
      if (auth.uid && tokenFromProfile === token && comment.content.length > 0) {
        this.props.updateComment(comment, momentId);
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
    updateComment: (comment, momentId) => dispatch(updateComment(comment, momentId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateComment)

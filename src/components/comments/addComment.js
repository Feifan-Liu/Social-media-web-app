import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addComment } from '../../store/actions/commentAction'

class AddComment extends Component {
  state = {
    content: '',
    momentId: this.props.momentId
  }

  //check token, and add comment and redirect to current moment page
  componentDidMount() {
    if (this.props.location.state) {
      const { auth, tokenFromProfile } = this.props;
      const { token, comment } = this.props.location.state
      if (auth.uid && tokenFromProfile === token && comment.content.length > 0) {
        this.props.addComment(comment);
      }
      this.props.history.push('/moment/' + comment.momentId);
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
    addComment: (comment) => dispatch(addComment(comment))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddComment)

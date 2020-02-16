import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import AddCommentPage from '../comments/addCommentPage'
import CommentList from '../comments/commentList'
import ShowButtons from './showButtons'
import { Link, Redirect } from 'react-router-dom'
import SwitchComment from './switchComment'
import firebase from 'firebase/app';
import { dislikeMoment, likeMoment, forwardMoment } from '../../store/actions/momentAction'


class MomentDetails extends Component {

  _isMounted = false
  state = { comments: {}, moment: null, user: null, firstUpdate: true, friends: [] };

  componentWillUnmount() {
    this._isMounted = false
  }

  handleForward = (e) => {
    this.props.forwardMoment(this.state.moment, this.props.match.params.id);
    this.props.history.push('/');
  }

  //adjust like image if user clicks on it 
  handleClick = (e) => {
    if (!this.props.auth.uid) {
      this.props.history.push('/login');
    } else {
      const icon = document.getElementById("like_icon");
      const id = this.props.match.params.id;
      const index = this.state.user.likedMoments.indexOf(id);
      if (icon.innerText === "favorite") {
        icon.innerText = "favorite_border";
        icon.className = "material-icons black-text";
        this.state.user.likedMoments.splice(index, 1)
        this.props.dislikeMoment(this.state.user, this.state.moment, id);
      } else {
        icon.innerText = "favorite";
        icon.className = "material-icons red-text";
        this.state.user.likedMoments.push(id);
        this.props.likeMoment(this.state.user, this.state.moment, id);
      }
    }
  }

  componentDidMount() {
    this._isMounted = true
    const id = this.props.match.params.id
    if (this.props.auth.uid) {
      const userId = this.props.auth.uid;

      //check if user likes this moment
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .onSnapshot(querySnapshot => {
          if (this._isMounted) {
            this.setState({ user: querySnapshot.data() });
          }
          if (this.state.user.likedMoments.indexOf(id) !== -1) {
            if (this._isMounted) {
              this.setState({
                userLikeMoment: true
              })
            }
          }
        })

      //retrieve and save all the user friends from firebase
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("friends")
        .onSnapshot(querySnapshot => {
          var friends = [];
          querySnapshot.forEach(function (doc) {
            friends.push(doc.data().id)
          })
          if (this._isMounted) {
            this.setState({
              friends: friends
            })
          }
        })
    }

    //check if the moment allows for comment, if so, retrieve and save all the comments from firebase
    firebase
      .firestore()
      .collection("moments")
      .doc(id)
      .onSnapshot(querySnapshot => {
        if (this._isMounted) {
          this.setState({ moment: querySnapshot.data() });

        }
        if (querySnapshot.data() && querySnapshot.data().commentIsOn) {
          firebase
            .firestore()
            .collection("moments")
            .doc(id)
            .collection("comments")
            .orderBy("createdAt", "desc")
            .onSnapshot(querySnapshot => {
              var comments = {};
              comments[id] = []
              querySnapshot.forEach(function (doc) {
                comments[id].push({
                  id: doc.id,
                  authorId: doc.data().authorId,
                  authorFirstName: doc.data().authorFirstName,
                  authorLastName: doc.data().authorLastName,
                  createdAt: doc.data().createdAt,
                  content: doc.data().content,
                  momentId: doc.data().momentId
                });
              });

              if (this._isMounted) {
                this.setState({ comments: comments });
              }
            })
        } else {
          if (this._isMounted) {
            this.setState({ comments: {} });
          }
        }
      })
  }

  //change like image if user already liked this moment
  componentDidUpdate() {
    const icon = document.getElementById("like_icon");
    if (this.state.firstUpdate && icon && this.state.userLikeMoment) {
      icon.innerText = "favorite";
      icon.className = "material-icons red-text";
      if (this._isMounted) {
        this.setState({
          firstUpdate: false
        })
      }
    }
  }

  render() {
    const { auth } = this.props;
    const { friends, comments } = this.state;
    const momentt = this.state.moment;

    //display moment details, buttons and all the comments for different users
    if (momentt && comments && friends) {
      if (!momentt.momentIsPublic && auth.uid !== momentt.authorId && friends.indexOf(momentt.authorId) === -1) return <Redirect to='/' />
      const links = (auth.uid ? (auth.uid === momentt.authorId
        ? <ShowButtons momentId={this.props.match.params.id} />
        : <button className="btn green lighten-1 btn-small right" onClick={this.handleForward}>Foward</button>) : null);
      const forward = (momentt.authorId !== momentt.originalAuthorId || momentt.originalMomentId
        ? <div>Originally posted by <Link to={'/user/' + momentt.originalAuthorId}> {momentt.originalAuthorFirstName} {momentt.originalAuthorLastName}</Link>
          Forwarded by <Link to={'/user/' + momentt.authorId}> {momentt.authorFirstName} {momentt.authorLastName}</Link></div>
        : <div >Posted by <Link to={'/user/' + momentt.authorId}> {momentt.authorFirstName} {momentt.authorLastName}</Link></div>)
      const originalLink = (momentt.authorId !== momentt.originalAuthorId || momentt.originalMomentId ? <div>Original Moment: <Link to={'/redirectPage/' + momentt.originalMomentId}>{momentt.originalTitle}</Link></div> : null)
      return (
        <div className="container section momentt-details">
          <div className="card z-depth-0">
            <div className="card-content">
              <SwitchComment moment={momentt} momentId={this.props.match.params.id} />
              <span className="card-title" >{momentt.title}
                <button id="like_btn" className="btn-flat btn-floating transparent" onClick={this.handleClick}>
                  <i id="like_icon" className="large material-icons black-text">favorite_border</i></button>
                <label htmlFor="like_icon">{momentt.like} people liked this Moment</label>
                {originalLink}
                {links}
              </span>
              <p>{momentt.content}</p>
            </div>
            <div className="card-action blue lighten-4 white-text">
              {forward}
              <div>{moment(momentt.createdAt.toDate()).calendar()}</div>
            </div>
          </div>
          <CommentList tokenFromProfile={this.props.tokenFromProfile} comments={comments} momentAuthId={momentt.authorId} commentIsOn={momentt.commentIsOn} />
          <AddCommentPage momentId={this.props.match.params.id} props={this.props} commentIsOn={momentt.commentIsOn} />
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Moment is gone...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.firebase.auth,
    tokenFromProfile: state.firebase.profile.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    likeMoment: (user, moment, momentId) => dispatch(likeMoment(user, moment, momentId)),
    dislikeMoment: (user, moment, momentId) => dispatch(dislikeMoment(user, moment, momentId)),
    forwardMoment: (moment, momentId) => dispatch(forwardMoment(moment, momentId))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MomentDetails)

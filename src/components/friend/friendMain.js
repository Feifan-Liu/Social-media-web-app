import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import FriendList from './friendList'
import MessageList from './messageList'
import FriendRequestList from './friendRequestList'
import { sendMessage, deleteMessage } from '../../store/actions/friendAction'
import firebase from 'firebase/app';

class FriendMain extends Component {

  constructor(props) {
    super(props)

    this.setChatUser = this.setChatUser.bind(this)
  }

  _isMounted = false

  //leave friend page
  componentWillUnmount() {
    this._isMounted = false
    const { uid } = this.props;
    if (uid) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          enterFriendPage: false,
          leaveFriendPageTime: new Date()
        })
    }
  }

  componentWillMount() {
    const { auth } = this.props;
    if (!auth.uid) {
      this.props.history.push('/');
    }
  }

  //enter friend page
  componentDidMount() {
    const { uid } = this.props;
    if (uid) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          enterFriendPage: true
        })
    }
  }

  componentDidUpdate() {

    //retrieve and save all the message from firebase
    if (!this.state.updated && this.props.firstFriend) {
      this.setState({
        chatUser: this.props.firstFriend,
        updated: true
      })
      this._isMounted = true
      const { uid } = this.props;
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("friends")
        .doc(this.props.firstFriend.id)
        .collection("message")
        .orderBy("time")
        .onSnapshot(querySnapshot => {
          var messages = {};
          messages[uid] = []
          querySnapshot.forEach(function (doc) {
            messages[uid].push({
              id: doc.id,
              message: doc.data().message,
              time: doc.data().time,
              from: doc.data().from,
              fromId: doc.data().fromId
            })
          })
          if (this._isMounted) {
            this.setState({ messages: messages });
          }
        })
    }
  }

  //if user clicks the message button on his friend, change current chat person,
  //retrieve and save all the message from firebase
  setChatUser(user) {
    const { uid } = this.props;
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("friends")
        .doc(user.id)
        .collection("message")
        .orderBy("time")
        .onSnapshot(querySnapshot => {
          var messages = {};
          messages[uid] = []
          querySnapshot.forEach(function (doc) {
            messages[uid].push({
              id: doc.id,
              message: doc.data().message,
              time: doc.data().time,
              from: doc.data().from,
              fromId: doc.data().fromId
            })
          })
          if (this._isMounted) {
            this.setState({ messages: messages });
          }
        })
    } else {
      user = []
      this.setState({
        messages: {},
      })
    }
    this.setState({
      chatUser: user,
    })
  }

  state = {
    chatUser: [],
    email: '',
    message: '',
    messages: {}
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  emailSearch() {
    this.props.history.push('/user/' + this.state.email);
  }

  sendMessage = (e) => {
    e.preventDefault();
    if (this.state.chatUser.id) {
      this.props.sendMessage(this.props.auth.uid, this.state.chatUser.id, this.state.message, this.props.profile.firstName);
    }
    this.setState({
      message: ""
    })
  }

  clearMessage = (e) => {
    const { auth } = this.props;
    const messages = this.state.messages;
    for (var key in messages) {
      var messageS = messages[key]
      for (var i in messageS) {
        this.props.deleteMessage(auth.uid, this.state.chatUser.id, messageS[i].id);
      }
    }
  }

  render() {
    const { friends, auth, friendRequest } = this.props;

    //if user not logged in, redirect page
    if (!auth.uid) return <Redirect to='/' />
    return (
      <div className="main container">
        <div className="row">
          <div className="col s12 m4">
            <div className="input-field">
              <input type="text" id="email" onChange={this.handleChange} value={this.state.email} />
              <label htmlFor="email">Email</label>
              <button className="btn blue lighten-1 btn-small"
                onClick={() => { this.emailSearch() }}>Search for User</button>
            </div>
            <FriendRequestList friendRequest={friendRequest} />
            <button className="btn red lighten-1 btn-small"
              onClick={this.clearMessage}> Clear Message</button>
            <FriendList friends={friends} setChatUser={this.setChatUser} />
          </div>
          <div className="col s12 m8">
            <div className="message">
              <MessageList messages={this.state.messages} />
            </div>
            <form className="white" onSubmit={this.sendMessage}>
              <div className="input-field">
                <input type="text" value={this.state.message} id="message" className="materialize-textarea" onChange={this.handleChange} />
                <label htmlFor="content">Send Message to {this.state.chatUser ? this.state.chatUser.firstName : null}</label>
              </div>
              <button name="send" className="btn blue lighten-1 btn-small">Send</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const id = state.firebase.auth.uid;
  const users = state.firestore.data.users;
  const user = users ? users[id] : null;
  const friendRequest = user ? (user.friendRequest ? user.friendRequest : null) : null;
  const friends = user ? (user.friends ? user.friends : null) : null;
  var firstFriend = null;
  if (friends) {
    for (var key in friends) {
      firstFriend = friends[key]
      break
    }
  }
  return {
    firstFriend: firstFriend,
    friendRequest: friendRequest,
    uid: id,
    user: user,
    friends: friends,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendMessage: (selfId, friendId, message, selfName) => dispatch(sendMessage(selfId, friendId, message, selfName)),
    deleteMessage: (selfId, friendId, messageId) => dispatch(deleteMessage(selfId, friendId, messageId)),
  }
}

//get colletion from database and save it into store
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => [
    { collection: 'users', doc: props.uid ? props.uid : "0", subcollections: [{ collection: 'friendRequest', orderBy: ['firstName', 'asc'] }] },
    { collection: 'users', doc: props.uid ? props.uid : "0", subcollections: [{ collection: 'friends', orderBy: ['firstName', 'asc'] }] }
  ])
)(FriendMain)

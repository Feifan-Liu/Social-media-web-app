import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../store/actions/authenticationAction'
import firebase from 'firebase/app'

class LoggedInNav extends Component {

  state = {
    newFriendRequest: 0,
    display: 'none',
    newMessage: 0,
    messageDisplay: 'none',
    newAt: 0,
    atDisplay: 'none'
  }

  _isMounted = false

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    const { uid } = this.props;


    //check if there is new @ from friends
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot(snapshot => {
        if (snapshot.data().enterAtPage != null && snapshot.data().leaveAtPageTime != null) {
          const enterAtPage = snapshot.data().enterAtPage
          const leaveAtPageTime = snapshot.data().leaveAtPageTime.toDate()
          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("notification")
            .onSnapshot(querySnapshot => {
              var newAt = 0
              querySnapshot.forEach(doc => {
                if (leaveAtPageTime < doc.data().time.toDate()) {
                  newAt += 1
                }
              })
              if (this._isMounted) {
                if (!enterAtPage) {
                  this.setState({
                    newAt: newAt,
                    atDisplay: newAt === 0 ? 'none' : 'inline'
                  })
                } else {
                  this.setState({
                    atDisplay: 'none'
                  })
                }
              }
            })
        }
      })


    //check if there is new message sending from friends
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot(snapshot => {
        if (snapshot.data().enterFriendPage != null && snapshot.data().leaveFriendPageTime != null) {
          const enterFriendPage = snapshot.data().enterFriendPage
          const leaveFriendPageTime = snapshot.data().leaveFriendPageTime.toDate()
          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("friends")
            .onSnapshot(querySnapshot => {
              querySnapshot.forEach(friendDoc => {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(uid)
                  .collection("friends")
                  .doc(friendDoc.id)
                  .collection("message")
                  .onSnapshot(querySnapshot => {
                    var newMessage = 0
                    querySnapshot.forEach(doc => {
                      if (leaveFriendPageTime < doc.data().time.toDate()) {
                        newMessage += 1
                      }
                    })
                    if (this._isMounted) {
                      if (!enterFriendPage) {
                        this.setState({
                          newMessage: newMessage,
                          messageDisplay: newMessage === 0 ? 'none' : 'inline'
                        })
                      } else {
                        this.setState({
                          messageDisplay: 'none'
                        })
                      }
                    }
                  })
              })
            })

          //check if there is new friend request
          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("friendRequest")
            .onSnapshot(querySnapshot => {
              var newFriendRequest = 0

              querySnapshot.forEach(function (doc) {
                if (leaveFriendPageTime < doc.data().createdAt.toDate()) {
                  newFriendRequest += 1
                }
              });
              if (this._isMounted) {
                if (!enterFriendPage) {
                  this.setState({
                    newFriendRequest: newFriendRequest,
                    display: newFriendRequest === 0 ? 'none' : 'inline'
                  })
                } else {
                  this.setState({
                    display: 'none'
                  })
                }
              }
            })
        }
      })
  }

  render() {
    return (
      <div>
        <ul className="right">
          <li>
            <NavLink to='/friend'>
              <span className="new badge red" style={{ display: this.state.display }}>
                {this.state.newFriendRequest}
              </span>
              Friend
            <span className="new badge red" style={{ display: this.state.messageDisplay }}>
                {this.state.newMessage}
              </span>
            </NavLink>
          </li>
          <li><NavLink to='/at'>@
          <span className="new badge red" style={{ display: this.state.atDisplay }}>
              {this.state.newAt}
            </span></NavLink></li>
          <li><NavLink to='/' onClick={this.props.logout}>Log Out</NavLink></li>
          <li><NavLink to={'/user/' + this.props.uid} className="btn btn-floating green lighten-1">
            {this.props.profile.initials}
          </NavLink></li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    uid: state.firebase.auth.uid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInNav)

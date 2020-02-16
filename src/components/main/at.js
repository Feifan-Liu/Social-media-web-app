import React, { Component } from 'react'
import moment from 'moment'
import { Link, Redirect } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import firebase from 'firebase/app';

class At extends Component {

  _isMounted = true

  state = {
    newAt: 0,
    display: 'none'
  }

  //leave at page
  componentWillUnmount() {
    this._isMounted = false
    const { uid } = this.props;
    if (uid) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          enterAtPage: false,
          leaveAtPageTime: new Date()
        })
    }
  }

  //enter at page
  componentDidMount() {
    const { uid } = this.props;
    if (uid) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          enterAtPage: true
        })
    }
  }

  render() {

    const { notifications, auth } = this.props;
    if (!auth.uid) return <Redirect to='/login' />

    //list all notifications for @
    if (notifications) {
      return (
        <div className="section">
          <div className="card z-depth-0">
            <div className="card-content center">
              <ul className="online-users">
                {Object.keys(notifications).map((key, value) => {
                  if (notifications[key]) {
                    return <li key={key}>
                      <Link to={'/user/' + notifications[key].fromId} className="green-text">{notifications[key].fromFirstName} {notifications[key].fromLastName} </Link>
                      <span>@you in Moment: </span>
                      <Link to={'/moment/' + notifications[key].momentId} onClick={this.handleClick}>{notifications[key].title}</Link>
                      <div className="note-date grey-text">{moment(notifications[key].time.toDate()).fromNow()}</div>
                    </li>
                  } else {
                    return <p>No @ found</p>
                  }
                })}
              </ul>
            </div>
          </div>
        </div>

      )
    } else {
      return (
        <p className="red-text center">No @ found</p>
      )
    }
  }
}
const mapStateToProps = (state) => {
  const id = state.firebase.auth.uid;
  const users = state.firestore.data.users;
  const user = id ? (users ? users[id] : null) : null;
  const notifications = user ? (user.notification ? user.notification : null) : null
  return {
    auth: state.firebase.auth,
    notifications: notifications,
    uid: state.firebase.auth.uid
  }
}

//get colletion from database and save it into store
export default compose(
  connect(mapStateToProps),
  firestoreConnect((props) => [
    { collection: 'users', doc: props.auth.uid ? props.auth.uid : '0', subcollections: [{ collection: 'notification', orderBy: ['time', 'desc'] }] },
  ])
)(At)

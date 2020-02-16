import React, { Component } from 'react'
import MomentList from '../moments/momentList'
import { connect } from 'react-redux'
import firebase from 'firebase/app';
import { Redirect } from 'react-router-dom'

class mainpage extends Component {

  _isMounted = false
  state = {
    moments: [],
    friends: []
  };

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true

    //if logged in user, retrieve and save all the moments and user friends from firebase
    if (this.props.auth.uid) {
      const uid = this.props.auth.uid
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("friends")
        .onSnapshot(querySnapshot => {
          var friends = [];
          querySnapshot.forEach(function (doc) {
            friends.push(doc.data().id)
          })
          if (this._isMounted) {
            this.setState({
              friends: friends
            }, () => {
              firebase
                .firestore()
                .collection("moments")
                .orderBy("createdAt", "desc")
                .onSnapshot(querySnapshot => {
                  var moments = [];
                  const friends = this.state.friends
                  querySnapshot.forEach(function (doc) {
                    if (doc.data().momentIsPublic || friends.indexOf(doc.data().authorId) !== -1 || uid === doc.data().authorId) {
                      moments.push({
                        id: doc.id,
                        ...doc.data()
                      });
                    }
                  });
                  if (this._isMounted) {
                    this.setState({ moments: moments }
                    );
                  }
                })
            });
          }
        })
    } 
    //if not logged in user, only retrieve and save all the moments from firebase
    else {
      firebase
        .firestore()
        .collection("moments")
        .orderBy("createdAt", "desc")
        .onSnapshot(querySnapshot => {
          var moments = [];
          querySnapshot.forEach(function (doc) {
            if (doc.data().momentIsPublic) {
              moments.push({
                id: doc.id,
                authorId: doc.data().authorId,
                commentIsOn: doc.data().commentIsOn,
                momentIsPublic: doc.data().momentIsPublic,
                authorFirstName: doc.data().authorFirstName,
                authorLastName: doc.data().authorLastName,
                createdAt: doc.data().createdAt,
                content: doc.data().content,
                title: doc.data().title,
                originalAuthorFirstName: doc.data().originalAuthorFirstName,
                originalAuthorLastName: doc.data().originalAuthorLastName,
                originalAuthorId: doc.data().originalAuthorId,
                originalMomentId: doc.data().originalMomentId
              });
            }
          });
          if (this._isMounted) {
            this.setState({ moments: moments });
          }
        })
    }
  }

  addMoment = () => {
    this.setState({ add: true });
  }

  render() {

    const { moments, friends } = this.state
    if (this.state && this.state.add) {
      return <Redirect to={{ pathname: '/addMoment', state: { token: this.props.token } }} />;
    }
    return (
      <div className="main container">
        <div className="row">
          <div className="col s12 center">
            <button className="btn black lighten-1 z-depth-0" onClick={this.addMoment}>Add New</button>
            <MomentList moments={moments} friends={friends} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    auth: state.firebase.auth,
    token: state.firebase.profile.token
  }
}

//get colletion from database and save it into store
export default connect(mapStateToProps)(mainpage)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addMoment } from '../../store/actions/momentAction'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';

class AddMoment extends Component {
  state = {
    title: '',
    content: '',
    momentIsPublic: true,
    friends: {},
    addresses: {},
    myMoments: []
  }

  _isMounted = true

  componentWillUnmount() {
    this._isMounted = false
  }

  //change @ and not @ friend list depending on what user clicks
  handleClick = (e) => {
    const id = e.target.id
    var addresses = this.state.addresses;
    var friends = this.state.friends
    if (e.target.className === "friend") {
      addresses[id] = friends[id];
      delete friends[id];
      this.setState({
        friends: friends,
        addresses: addresses
      })
    } else if (e.target.className === "address") {
      friends[id] = addresses[id];
      delete addresses[id];
      this.setState({
        friends: friends,
        addresses: addresses
      })
    }
  }


  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleRadioChange = (e) => {
    if (e.target.id === "momentIsPublic") {
      this.setState({
        [e.target.name]: true
      })
    }
    else if (e.target.id === "momentIsPrivate") {
      this.setState({
        [e.target.name]: false
      })
    }
  }

  //add moment and redirect to main page
  handleSubmit = (e) => {
    e.preventDefault();
    const moment = {
      title: this.state.title,
      content: this.state.content,
      momentIsPublic: this.state.momentIsPublic
    }
    if (this.state.title) {
      this.props.addMoment(this.state.myMoments, moment, Object.keys(this.state.addresses));
      this.props.history.push('/');
    }
  }

  //retrieve and save all the friends from firebase
  componentDidMount() {
    this._isMounted = true
    const { auth } = this.props;
    if (!auth.uid) {
      this.props.history.push('/login');
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(this.props.auth.uid)
        .collection("friends")
        .onSnapshot(querySnapshot => {
          var friends = {};
          querySnapshot.forEach(function (doc) {
            const id = doc.id;
            friends[id] = [];
            friends[id].push({
              id: doc.data().id,
              email: doc.data().email,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              joined: doc.data().joined
            })
          })
          if (this._isMounted) {
            this.setState({
              friends: friends
            })
          }
        })
      firebase
        .firestore()
        .collection("users")
        .doc(this.props.auth.uid)
        .onSnapshot(querySnapshot => {
          if (this._isMounted) {
            this.setState({
              myMoments: querySnapshot.data().myMoments
            })
          }
        })
    }
  }

  render() {
    //if not logged in user, redirect to login page
    const { auth, tokenFromProfile } = this.props;
    if (!auth.uid) return <Redirect to='/login' />
    if (!this.props.location.state) return <Redirect to='/login' />
    const { friends, addresses } = this.state;
    const { token } = this.props.location.state
    //check token
    if (tokenFromProfile !== token) return <Redirect to='/login' />
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Create a New Moment</h5>
          <div className="input-field">
            <input type="text" id='title' onChange={this.handleChange} />
            <label htmlFor="title">Moment Title</label>
          </div>
          <div className="input-field">
            <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="content">Moment Content</label>
          </div>
          <div className="radio">
            <p className="right">
              <label>
                <input id="momentIsPublic" name="momentIsPublic" className="with-gap" type="radio" checked={this.state.momentIsPublic} onChange={this.handleRadioChange} />
                <span>Public</span>
              </label>
            </p>
            <p className="right">
              <label>
                <input id="momentIsPrivate" name="momentIsPublic" className="with-gap" type="radio" checked={!this.state.momentIsPublic} onChange={this.handleRadioChange} />
                <span>Private</span>
              </label>
            </p>
          </div>
          <div>
            <button className="btn black lighten-1">Create</button>
          </div>
        </form><br></br>
        <div className="row">
          <div>
            <ul className="collection col s12 m6">
              <li className="collection=item center">@</li>
              {Object.keys(addresses).map((key, value) => {
                if (addresses[key]) {
                  return (
                    <div className="at card-title collection-item center hoverable" key={key}>
                      <li className="address" id={key} onClick={this.handleClick}>{addresses[key][0].firstName} {addresses[key][0].lastName} {addresses[key][0].email}</li>
                    </div>
                  )
                } else {
                  return ''
                }
              })}
            </ul>
          </div>

          <div >
            <ul className="collection col s12 m6">
              <li className="card-title collection=item center">Click to @</li>
              {Object.keys(friends).map((key, value) => {
                if (friends[key]) {
                  return (
                    <div className="at card-title collection-item center hoverable " key={key}>
                      <li className="friend" id={key} onClick={this.handleClick}>{friends[key][0].firstName} {friends[key][0].lastName} {friends[key][0].email}</li>
                    </div>
                  )
                } else {
                  return ''
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    )
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
    addMoment: (myMoments, moment, addresses) => dispatch(addMoment(myMoments, moment, addresses))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMoment)

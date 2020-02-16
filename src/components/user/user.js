import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect, Link } from 'react-router-dom'
import moment from 'moment'
import { friendRequest } from '../../store/actions/friendAction'
import firebase from 'firebase/app';
import MomentSummary from '../moments/momentSummary'

class User extends Component {

    _isMounted = true


    componentWillUnmount() {
        this._isMounted = false;
    }

    state = {
        users: [],
        isFriend: false,
        requested: false,
        user: {},
        userId: this.props.userId,
        selfId: this.props.auth.uid,
        display: this.props.display,
        message: "",
        myMoments: [],
        likedMoments: []
    }

    componentDidMount() {
        this._isMounted = true

        //retrive and save all users
        firebase.firestore().collection('users').onSnapshot(querySnapshot => {
            var users = []
            querySnapshot.forEach(function (doc) {
                users.push({
                    ...doc.data()
                })
            })
            if (this._isMounted) {
                this.setState({
                    users: users,
                })
            }
        })

    }

    //check if user is a friend, if not, check if user already sent a request
    componentDidUpdate() {
        if (!this.state.updated && this._isMounted) {
            firebase.firestore().collection('users').onSnapshot(querySnapshot => {
                var users = []
                querySnapshot.forEach(function (doc) {
                    users.push({
                        ...doc.data()
                    })
                })
                if (this._isMounted) {
                    this.setState({
                        users: users,
                    })
                }
            })
            //find user by email
            if (this.props.match.params.id.includes("@")) {
                const users = this.props.users
                if (true) {
                    for (var key in users) {
                        if (this.props.match.params.id === users[key].email) {
                            if (this._isMounted) {
                                this.setState({
                                    user: users[key],
                                    updated: true,
                                    userId: key,
                                    display: this.state.selfId === key ? 'none' : 'inline'
                                })
                            }

                            if (this._isMounted) {
                                firebase.firestore().collection('users').doc(key).collection('friends')
                                    .doc(this.props.auth.uid).onSnapshot(snapshot => {
                                        if (this._isMounted) {
                                            if (snapshot.data()) {
                                                if (this._isMounted) {
                                                    this.setState({
                                                        isFriend: true,
                                                        message: "This user is your friend",
                                                        display: 'none'
                                                    })
                                                }
                                            } else {
                                                if (this._isMounted) {
                                                    this.setState({
                                                        isFriend: false,
                                                    })
                                                }
                                                if (this._isMounted) {
                                                    firebase.firestore().collection('users').doc(this.state.userId).collection('friendRequest')
                                                        .doc(this.props.auth.uid).onSnapshot(snapshot => {
                                                            if (this._isMounted) {
                                                                if (snapshot.data()) {
                                                                    if (this._isMounted) {
                                                                        this.setState({
                                                                            requested: true,
                                                                            message: "You already sent a request",
                                                                            display: 'none'
                                                                        })
                                                                    }
                                                                } else {
                                                                    if (this._isMounted && !this.state.isFriend) {
                                                                        this.setState({
                                                                            requested: false,
                                                                            message: "",
                                                                            display: this.state.selfId === this.state.userId ? 'none' : 'inline'
                                                                        })
                                                                    }

                                                                }
                                                            }
                                                        })
                                                }
                                            }
                                        }
                                    })
                            }
                        }
                    }
                }
            }
            //find user by id
            else {
                this.setState({
                    updated: true
                })
                if (this._isMounted) {
                    firebase.firestore().collection('users').doc(this.props.match.params.id).onSnapshot(snapshot => {
                        if (snapshot.data() && this._isMounted) {
                            const myMoments = snapshot.data().myMoments;
                            let mymoments = [];
                            let momentId = [];
                            for (const i in myMoments) {
                                if (this._isMounted) {
                                    firebase
                                        .firestore()
                                        .collection("moments")
                                        .doc(myMoments[i])
                                        .onSnapshot(querySnapshot => {
                                            if (querySnapshot.data() && momentId.indexOf(querySnapshot.id) === -1) {
                                                if (this._isMounted) {
                                                    momentId.push(querySnapshot.id);
                                                    mymoments.push({
                                                        id: querySnapshot.id,
                                                        ...querySnapshot.data()
                                                    });
                                                }
                                                if (this._isMounted) {
                                                    this.setState({ myMoments: mymoments });
                                                }
                                            }
                                        })
                                }
                            }
                        }
                    })
                }

                //check if user is a friend, if not, check if user already sent a request
                if (this._isMounted) {
                    firebase.firestore().collection('users').doc(this.props.match.params.id).collection('friends')
                        .doc(this.props.auth.uid).onSnapshot(snapshot => {
                            if (this._isMounted) {
                                if (snapshot.data()) {
                                    if (this._isMounted) {
                                        this.setState({
                                            isFriend: true,
                                            message: "This user is your friend",
                                            display: 'none'
                                        })
                                    }
                                } else {
                                    if (this._isMounted) {
                                        this.setState({
                                            isFriend: false,
                                        })
                                    }
                                    if (this._isMounted) {
                                        firebase.firestore().collection('users').doc(this.props.match.params.id).collection('friendRequest')
                                            .doc(this.props.auth.uid).onSnapshot(snapshot => {
                                                if (this._isMounted) {
                                                    if (snapshot.data()) {
                                                        if (this._isMounted) {
                                                            this.setState({
                                                                requested: true,
                                                                message: "You already sent a request",
                                                                display: 'none'
                                                            })
                                                        }
                                                    } else {
                                                        if (this._isMounted && !this.state.isFriend) {
                                                            this.setState({
                                                                requested: false,
                                                                message: "",
                                                                display: this.state.selfId === this.state.userId ? 'none' : 'inline'
                                                            })
                                                        }

                                                    }
                                                }
                                            })
                                    }
                                }
                            }
                        })
                }
            }
        }
    }

    //send friend request
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.state.requested) {
            this.props.friendRequest(this.state.selfId, this.state.userId, this.props.self);
        }
    }
    render() {
        const redirect = this.props.location ? (this.props.location.state ? this.props.location.state.redirect : true) : true
        const { auth, userId } = this.props;
        const { myMoments, likedMoments } = this.state;
        if (redirect) return <Redirect to={"/redirectUserPage/" + userId} />
        var user = this.props.user
        //if not logged in user, redirect to login page
        if (!auth.uid) return <Redirect to='/login' />
        if (!user) {
            user = this.state.user
        }
        if (user && user.joined && this._isMounted && myMoments && likedMoments) {
            return (
                <div className = "row">
                    <div className="container center">
                        <form className="whit col s12" onSubmit={this.handleSubmit}>
                            <h5 className="grey-text text-darken-3">{user.firstName} {user.lastName}</h5>
                            <p className="grey-text">Email: {user.email}</p>
                            <p className="grey-text">Joined: {moment(user.joined.toDate()).calendar()}</p>
                            <button style={{ display: this.state.display }} className="btn black lighten-1">Send Friend Request</button>
                            <p className="red-text"> {this.state.message}</p>
                        </form>
                        <div className="contianer col s12">
                            <div>
                                <h4 className = "blue-text">User Posts:</h4>
                                {myMoments.map(moment => {
                                    return (
                                        <Link to={'/moment/' + moment.id} key={moment.id}>
                                            <MomentSummary momentt={moment} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container center">
                    <p>No user found</p>
                </div>
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    var user = {}
    const users = state.firestore.data.users;
    const self = users ? users[state.firebase.auth.uid] : null;
    const id = ownProps.match.params.id;
    user = users ? users[id] : null;
    return {
        users: users,
        self: self,
        userId: id,
        user: user,
        auth: state.firebase.auth,
        display: state.firebase.auth.uid === id ? 'none' : 'inline'
    }

}

const mapDispatchToProps = dispatch => {
    return {
        friendRequest: (selfId, friendId, self) => dispatch(friendRequest(selfId, friendId, self))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' }
    ])
)(User)

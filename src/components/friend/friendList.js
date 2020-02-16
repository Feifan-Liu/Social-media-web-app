import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { deleteFriend } from '../../store/actions/friendAction'
import { connect } from 'react-redux'

class FriendList extends Component {
    handleDelete = (e) => {
        this.setState({ updatePage: true });
        this.props.deleteFriend(this.props.auth.uid, e.target.id);
        const friends = this.props.friends

        var firstFriend = null
        for (var key in friends) {
            if (key !== e.target.id) {
                firstFriend = friends[key]
                break
            }
        }
        this.setChatUser(firstFriend)

    }
    setChatUser = (user) => {
        this.props.setChatUser(user)
    }

    //list all the friends
    render() {
        const friends = this.props.friends
        if (friends) {
            return (
                <div className="friend-list section">
                    {Object.keys(friends).map((key, value) => {
                        if (friends[key]) {
                            return (
                                <div className="card-title" key={key}>
                                    <p>
                                        <Link className="hoverable" to={'/user/' + friends[key].id}> {friends[key].firstName} {friends[key].lastName}
                                        </Link>
                                        <button className="btn-floating btn waves-effect waves-light blue"
                                            onClick={() => { this.setChatUser(friends[key]) }}><i id={friends[key].id} className="material-icons">message</i></button>
                                        <button className="btn-floating btn waves-effect waves-light red"
                                            onClick={this.handleDelete}><i id={friends[key].id} className="material-icons">delete</i></button>
                                    </p>
                                </div>
                            )
                        } else {
                            return ''
                        }
                    })}
                </div>
            )
        } else {
            return ''
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteFriend: (selfId, friendId) => dispatch(deleteFriend(selfId, friendId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
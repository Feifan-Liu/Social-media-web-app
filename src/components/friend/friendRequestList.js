import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { addFriend, deleteFriendRequest} from '../../store/actions/friendAction'
import { connect } from 'react-redux'

class FriendRequestList extends Component {
    state = {
        friend: ''
    }
    accept = (friend) => {
        this.props.addFriend(this.props.auth.uid, friend);
        this.props.deleteFriendRequest(this.props.auth.uid, friend.id);
    }
    reject = (friendId) => {
        this.props.deleteFriendRequest(this.props.auth.uid, friendId);
    }

    //display friend request
    render() {
        const friendRequest = this.props.friendRequest
        if (friendRequest) {
            return (
                <div className="friend-list section">
                    {Object.keys(friendRequest).map((key, value) => {
                        if (friendRequest[key]) {

                            return (
                                <div className="card-title" key={key}>
                                    <p>
                                    You received a friend request from <Link className="hoverable" to={'/user/' + friendRequest[key].id}> 
                                    {friendRequest[key].firstName} {friendRequest[key].lastName} 
                                    </Link>
                                    <button className="btn-floating btn waves-effect waves-light green" 
                                    onClick={()=>{this.accept(friendRequest[key])}}><i id = {friendRequest[key].id} 
                                    className="material-icons"> check</i></button>
                                    <button className="btn-floating btn waves-effect waves-light red" 
                                    onClick={()=>{this.reject(friendRequest[key].id)}}><i id = {friendRequest[key].id} 
                                    className="material-icons">close</i></button>
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
        addFriend: (selfId, friend) => dispatch(addFriend(selfId, friend)),
        deleteFriendRequest: (selfId, friendId) => dispatch(deleteFriendRequest(selfId, friendId)),
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(FriendRequestList)
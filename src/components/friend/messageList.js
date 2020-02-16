import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

class MessageList extends Component {
    handleDelete = (e) => {
        this.setState({ updatePage: true });
    }

    //display message list
    render() {
        const { auth } = this.props;
        const messages = this.props.messages
        if (messages) {
            return (
                <div className="row" >
                    <div className="friend-list section">
                        {Object.keys(messages).map((key, value) => {
                            return messages[key] && messages[key].map(message => {
                                if (auth.uid === message.fromId) {
                                    return (
                                        <div className="card-container" key={message.id}>
                                            <span className="col s12 card-content center grey-text">
                                                {moment(message.time.toDate()).calendar()}
                                            </span>
                                            <div className="col s12 card-content green" key={message.id}>
                                                <span className="right white-text">{message.message}:{message.from}</span>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="card-container" key={message.id}>
                                            <span className="col s12 card-content center grey-text">
                                                {moment(message.time.toDate()).calendar()}
                                            </span>
                                            <span className="col s12 card-content white-text blue left">{message.from}:{message.message}</span>
                                        </div>
                                    )
                                }
                            })
                        })}
                    </div>
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
        //deleteFriend: (selfId, friendId) => dispatch(deleteFriend(selfId, friendId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { updateMoment } from '../../store/actions/momentAction'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app';

class UpdateMoment extends Component {

    _isMounted = false
    state = { 
        id: this.props.match.params.id,
        title: "",
        content: "",
        moment: [] 
    };

    componentWillUnmount() {
        this._isMounted = false
    }

    //prepopulate moment details to inut field
    componentDidMount() {
        this._isMounted = true

        firebase
            .firestore()
            .collection("moments")
            .doc(this.props.match.params.id)
            .onSnapshot(querySnapshot => {

                var moment = querySnapshot.data()
                if (this._isMounted) {
                    this.setState({ 
                        title: moment.title,
                        content: moment.content,
                        moment: moment 
                    });
                }

            })

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    //add moment and redirect to main page
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.updateMoment(this.state);
        this.setState({ updatePage: true });
    }
    render() {
        const { momentt, momentId, auth, tokenFromProfile } = this.props;
        //if not logged in user, redirect to login page
        if (!auth.uid) return <Redirect to='/login' />
        //check token
        if(!this.props.location.state) return <Redirect to='/login' />
        const {token} = this.props.location.state 
        if(tokenFromProfile !== token) return <Redirect to='/login' />
        if (this.state && this.state.updatePage) {
            return <Redirect to={"/moment/" + momentId} />
        }
        if (this.state && momentt) {
            return (
                <div className="container">
                    <form className="white" onSubmit={this.handleSubmit}>
                        <h5 className="grey-text text-darken-3">Update Moment</h5>
                        <div className="input-field">
                            <input type="text" id='title' placeholder="Moment title" value={this.state.title} onChange={this.handleChange} />
                        </div>
                        <div className="input-field">
                            <textarea id="content" placeholder="Moment Content" value={this.state.content} className="materialize-textarea" onChange={this.handleChange}></textarea>
                        </div>
                        <div className="input-field" id={momentId}>
                            <button className="btn black lighten-1">Update</button>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (
                <div className="container center">
                    <p>Loading moment...</p>
                </div>
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const moments = state.firestore.data.moments;
    const moment = moments ? moments[id] : null;
    return {
        id,
        momentt: moment,
        momentId: id,
        auth: state.firebase.auth,
        tokenFromProfile: state.firebase.profile.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateMoment: (moment) => dispatch(updateMoment(moment))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'moments' }
    ])
)(UpdateMoment)

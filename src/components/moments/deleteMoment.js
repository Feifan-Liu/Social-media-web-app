import { deleteMoment } from '../../store/actions/momentAction'
import { connect } from 'react-redux'
import { Component } from 'react'
import firebase from 'firebase/app';

class DeleteMoment extends Component {
    _isMounted = false
    state = {
        myMoments: []
    }
    //check token

    componentWillUnmount() {
        this._isMounted = false
    }


    componentDidMount() {
        this._isMounted = true
        firebase
            .firestore()
            .collection("users")
            .doc(this.props.auth.uid)
            .onSnapshot(querySnapshot => {
                if (this._isMounted) {
                    this.setState({
                        myMoments: querySnapshot.data().myMoments
                    }, () => {                        
                        const { auth, tokenFromProfile } = this.props;
                        if (this.props.location.state) {
                            console.log(this.props.location.state)                       
                            const { token, momentId } = this.props.location.state
                            if (token) {                                
                                if (auth.uid && tokenFromProfile === token) {
                                    this.props.deleteMoment(this.state.myMoments, momentId);
                                }
                            }
                        }
                        this.props.history.push('/');
                    })
                }
            })
    }

    render() {
        return null
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
        deleteMoment: (myMoments, momentId) => dispatch(deleteMoment(myMoments, momentId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMoment)
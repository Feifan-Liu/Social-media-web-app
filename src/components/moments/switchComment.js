import React, { Component } from 'react'
import { connect } from 'react-redux'
import {switchComment,switchMoment} from '../../store/actions/momentAction'
//import { Redirect } from 'react-router-dom'

export class SwitchComment extends Component {
    state = {
        commentIsOn : this.props.moment.commentIsOn,
        momentIsPublic: this.props.moment.momentIsPublic,
        display : 'none'
    }
    handleChange = (e) => {
        if(e.target.id === "commentIsOn"){
            this.setState({
                [e.target.name]: true
            },() => {
                this.props.switchComment(this.props.momentId,this.state.commentIsOn)
            })
        }
        else if(e.target.id === "commentIsOff"){
            this.setState({
                [e.target.name]: false
            },() => {
                this.props.switchComment(this.props.momentId,this.state.commentIsOn)
            })
        }
        else if(e.target.id === "momentIsPublic"){
            this.setState({
                [e.target.name]: true
            },() => {
                this.props.switchMoment(this.props.momentId,this.state.momentIsPublic)
            })
        }
        else if(e.target.id === "momentIsPrivate"){
            this.setState({
                [e.target.name]: false
            },() => {
                this.props.switchMoment(this.props.momentId,this.state.momentIsPublic)
            })
        }
    }

    componentDidMount(){
        if(this.props.moment.authorId === this.props.auth.uid){
            this.setState({
                commentIsOn : this.props.moment.commentIsOn,
                momentIsPublic: this.props.moment.momentIsPublic,
                display : 'inline'
            });
        }
    }
    render() {
    return (
      <div>
        <p style={{display:this.state.display}} className="right">
            <label>
            <input id="momentIsPublic" name="momentIsPublic" className="with-gap" type="radio"  checked={this.props.moment.momentIsPublic} onChange={this.handleChange}/>
            <span>Public</span>
            </label>
        </p>
        <p style={{display:this.state.display}} className="right">
            <label>
            <input id="momentIsPrivate" name="momentIsPublic" className="with-gap" type="radio" checked={!this.props.moment.momentIsPublic} onChange={this.handleChange}/>
            <span>Private</span>
            </label>
        </p>

         <p style={{display:this.state.display}} className="right">
            <label>
            <input id="commentIsOn" name="commentIsOn" className="with-gap" type="radio"  checked={this.props.moment.commentIsOn} onChange={this.handleChange}/>
            <span>Comment On</span>
            </label>
        </p>
        <p style={{display:this.state.display}} className="right">
            <label>
            <input id="commentIsOff" name="commentIsOn" className="with-gap" type="radio" checked={!this.props.moment.commentIsOn} onChange={this.handleChange}/>
            <span>Comment Off</span>
            </label>
        </p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth
    }
  }

const mapDispatchToProps = dispatch => {
    return {
      switchComment: (momentId,commentIsOn) => dispatch(switchComment(momentId,commentIsOn)),
      switchMoment: (momentId,momentIsPublic) => dispatch(switchMoment(momentId,momentIsPublic))
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(SwitchComment)

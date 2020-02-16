import React from 'react'
import { NavLink } from 'react-router-dom'
import LoggedinNav from './loggedinNav'
import LoggedoutNav from './loggedoutNav'
import { connect } from 'react-redux'

const mainNav = (props) => {
  const { auth, profile } = props;

  //only display corresponding nav links for logged in or not logged in user
  const links = auth.uid ? <LoggedinNav profile={profile} /> : <LoggedoutNav />;

  return (
    <nav className="nav-wrapper blue darken-3">
      <div className="container">
        <NavLink to='/' className="brand-logo left">Momentary</NavLink>
        {links}
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

export default connect(mapStateToProps)(mainNav)

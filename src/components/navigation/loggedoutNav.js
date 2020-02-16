import React from 'react'
import { NavLink } from 'react-router-dom'

const LoggedoutNav = () => {
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/register'>Register</NavLink></li>
        <li><NavLink to='/login'>Login</NavLink></li>
      </ul>
    </div>
  )
}

export default LoggedoutNav
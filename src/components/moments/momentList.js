import React from 'react'
import MomentSummary from './momentSummary'
import { Link } from 'react-router-dom'

const MomentList = ({moments}) => {
  
  return (
    <div className="moment-list section">
      { moments && moments.map(moment => {
        return (
          <Link to={'/moment/' + moment.id} key={moment.id}>
            <MomentSummary momentt={moment}/>
          </Link>
        )
      })}  
    </div>
  )
}

export default MomentList

import React from 'react'
import moment from 'moment'

const MomentSummary = ({ momentt }) => {
  if (momentt && momentt.createdAt) {
    const forwardorNot = (momentt.authorId !== momentt.originalAuthorId || momentt.originalMomentId ? 
    <p>Originally posted by {momentt.originalAuthorFirstName} {momentt.originalAuthorLastName}
      <br></br> Forwarded by {momentt.authorFirstName} {momentt.authorLastName}</p> : 
      <p>Posted by {momentt.authorFirstName} {momentt.authorLastName}</p>);
    return (
      <div className="card z-depth-0 momentt-summary">
        <div className="card-content grey-text text-darken-3">
          <span className="card-title blue-text">{momentt.title}</span>
          <span className = "green-text">
            {forwardorNot}
          </span>
          <p className="grey-text">{moment(momentt.createdAt.toDate()).calendar()}</p>
        </div>
      </div>
    )
  }else{
    return null;
  }
}

export default MomentSummary

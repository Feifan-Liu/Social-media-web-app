import React from 'react'
import CommentSummary from './commentSummary'

const CommentList = ({ tokenFromProfile, comments, momentAuthId, commentIsOn }) => {

  //list all the comments
  if (commentIsOn) {
    if (comments) {
      return (
        <div className="moment-list section">
          {Object.keys(comments).map((key, value) => {
            
            return comments[key] && comments[key].map(comment => {
              return (
                <div className="card-title" key={comment.id}>
                  <CommentSummary tokenFromProfile={tokenFromProfile} comment={comment} commentId={comment.id} momentAuthId={momentAuthId} />
                </div>
              )
            })

          })
          }
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>No Comment...</p>
        </div>
      )
    }
  }
  else {
    return null
  }
}

export default CommentList

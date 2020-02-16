export const addComment = (comment) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const authorId = getState().firebase.auth.uid;
      firestore.collection('moments').doc(comment.momentId).collection('comments').add({
        ...comment,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date()
      }).then(() => {
        dispatch({ type: 'CREATE_COMMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'CREATE_COMMENT_ERROR' }, err);
      });
    }
  };

export const deleteComment = (commentId,momentId) => {
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    firestore.collection('moments').doc(momentId).collection('comments').doc(commentId).delete().then(() => {
      dispatch({ type: 'DELETE_COMMENT_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'DELETE_COMMENT_ERROR' }, err);
    });
  }
};

export const updateComment = (comment,momentId) => {
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    firestore.collection('moments').doc(momentId).collection('comments').doc(comment.id).update({
      content: comment.content
    }).then(() => {
      dispatch({ type: 'UPDATE_COMMENT_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'UPDATE_COMMENT_ERROR' }, err);
    });
  }
};
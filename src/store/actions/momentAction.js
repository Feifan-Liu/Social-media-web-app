export const addMoment = (myMoments,moment,addresses) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const authorId = getState().firebase.auth.uid;
      firestore.collection('moments').add({
        ...moment,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        originalAuthorFirstName: profile.firstName,
        originalAuthorLastName: profile.lastName,
        originalAuthorId: authorId,
        originalTitle: moment.title,
        commentIsOn: true,
        like: 0,
        createdAt: new Date()
      }).then(resp => {
        myMoments.push(resp.id);
        firestore.collection('users').doc(authorId).update({
          myMoments: myMoments
        })
        for(const offset in addresses){
          firestore.collection('users').doc(addresses[offset]).collection('notification').add({
            momentId: resp.id,
            title: moment.title,
            fromId: authorId,
            fromFirstName: profile.firstName,
            fromLastName: profile.lastName,
            time: new Date()
          })
        }
        dispatch({ type: 'CREATE_MOMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'CREATE_MOMENT_ERROR' }, err);
      });
    }
  };

  export const forwardMoment = (moment,momentId) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const authorId = getState().firebase.auth.uid;
      const originalMomentId = moment.originalMomentId ? moment.originalMomentId : momentId;
      firestore.collection('moments').add({
        ...moment,
        originalMomentId,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        commentIsOn: true,
        like: 0,
        createdAt: new Date()
      }).then(() => {
        dispatch({ type: 'FORWARD_MOMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'FORWARD_MOMENT_ERROR' }, err);
      });
    }
  };

  export const updateMoment = (moment) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const authorId = getState().firebase.auth.uid;
      firestore.collection('moments').doc(moment.id).update({
        title: moment.title,
        content: moment.content
      }).then(() => {
        firestore.collection('users').doc(authorId).update({
          lastUpdate: new Date()
        })
        dispatch({ type: 'UPDATE_MOMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'UPDATE_MOMENT_ERROR' }, err);
      });
    }
  };

  export const deleteMoment = (myMoments,momentId) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const authorId = getState().firebase.auth.uid;
      firestore.collection('moments').doc(momentId).delete().then(() => {
        myMoments.splice(myMoments.indexOf(momentId),1)
        firestore.collection('users').doc(authorId).update({
          myMoments: myMoments
        })
        dispatch({ type: 'DELETE_MOMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'DELETE_MOMENT_ERROR' }, err);
      });
    }
  };

  export const switchComment = (momentId,commentIsOn) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      firestore.collection('moments').doc(momentId).update({
        commentIsOn: commentIsOn
      }).then(() => {
        dispatch({ type: 'SWITCH_COMMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'SWITCH_COMMENT_ERROR' }, err);
      });
    }
  };

  export const switchMoment = (momentId,momentIsPublic) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      firestore.collection('moments').doc(momentId).update({
        momentIsPublic: momentIsPublic,
      }).then(() => {
        dispatch({ type: 'SWITCH_MOMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'SWITCH_MOMENT_ERROR' }, err);
      });
    }
  };

  export const likeMoment = (user,moment,momentId) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const userId = getState().firebase.auth.uid;
      firestore.collection('users').doc(userId).update({
        likedMoments: user.likedMoments
      }).then(() => {
        firestore.collection('moments').doc(momentId).update({
          like: moment.like + 1
        }).then(() => {
          dispatch({ type: 'LIKE_MOMENT_SUCCESS' });
        }).catch(err => {
          dispatch({ type: 'LIKE_MOMENT_ERROR' }, err);
        });
      });
    }
  };

  export const dislikeMoment = (user,moment,momentId) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const userId = getState().firebase.auth.uid;
      firestore.collection('users').doc(userId).update({
        likedMoments: user.likedMoments
      }).then(() => {
        firestore.collection('moments').doc(momentId).update({
          like: moment.like - 1
        }).then(() => {
          dispatch({ type: 'DISLIKE_MOMENT_SUCCESS' });
        }).catch(err => {
          dispatch({ type: 'DISLIKE_MOMENT_ERROR' }, err);
        });
      });
    }
  };
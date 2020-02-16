export const addFriend = (selfId, friend) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    firestore.collection('users').doc(selfId).collection('friends').doc(friend.id).set({
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      email: friend.email,
      joined: friend.joined
    }).then(() => {
      dispatch({ type: 'ADD_FRIEND_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'ADD_FRIEND_ERROR' }, err);
    });
    firestore.collection('users').doc(friend.id).collection('friends').doc(selfId).set({
      id: selfId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      joined: profile.joined
    }).then(() => {
      dispatch({ type: 'ADD_FRIEND_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'ADD_FRIEND_ERROR' }, err);
    });
  }
};

export const friendRequest = (selfId, friendId, self) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('users').doc(friendId).collection('friendRequest').doc(selfId).set({
      id: selfId,
      firstName: self.firstName,
      lastName: self.lastName,
      email: self.email,
      joined: self.joined,
      createdAt: new Date()
    }).then(() => {
      dispatch({ type: 'ADD_FRIENDREAUEST_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'ADD_FRIENDREAUEST_ERROR' }, err);
    });
  }
};

export const sendMessage = (selfId, friendId, message, selfName) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('users').doc(selfId).collection('friends').doc(friendId)
    .collection('message').add({
      message: message,
      time: new Date(),
      from: selfName,
      fromId: selfId,
      toId: friendId
    }).then(() => {
      dispatch({ type: 'ADD_MESSAGE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'ADD_MESSAGE_ERROR' }, err);
    });
    firestore.collection('users').doc(friendId).collection('friends').doc(selfId)
    .collection('message').add({
      message: message,
      time: new Date(),
      from: selfName,
      fromId: selfId,
      toId: friendId
    }).then(() => {
      dispatch({ type: 'ADD_MESSAGE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'ADD_MESSAGE_ERROR' }, err);
    });
  }
};

export const deleteFriendRequest = (selfId, friendId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('users').doc(selfId).collection('friendRequest').doc(friendId).delete().then(() => {
      dispatch({ type: 'DELETE_FRIENDREAUEST_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'DELETE_FRIENDREAUEST_ERROR' }, err);
    });
  }
};

export const deleteFriend = (selfId, friendId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('users').doc(selfId).collection('friends').doc(friendId).delete().then(() => {
      dispatch({ type: 'DELETE_FRIEND_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'DELETE_FRIEND_ERROR' }, err);
    });
    firestore.collection('users').doc(friendId).collection('friends').doc(selfId).delete().then(() => {
      dispatch({ type: 'DELETE_FRIEND_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'DELETE_FRIEND_ERROR' }, err);
    });
  }
};

export const deleteMessage = (selfId,friendId,messageId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('users').doc(selfId).collection('friends').doc(friendId).collection('message').doc(messageId).delete().then(() => {
      dispatch({ type: 'DELETE_MESSAGE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'DELETE_MESSAGE_ERROR' }, err);
    });
  }
};

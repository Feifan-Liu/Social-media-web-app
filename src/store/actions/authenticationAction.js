export const login = (credentials) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
      const firebase = getFirebase();
      const firestore = getFirestore();
      
      firebase.auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      ).then(resp => {
        return firestore.collection('users').doc(resp.user.uid).update({
          token: makeToken()
        });
      }).then(() => {
        dispatch({ type: 'LOGIN_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'LOGIN_ERROR', err });
      });
  
    }
  }
  
  export const logout = () => {
    return (dispatch, getState, {getFirebase}) => {
      const firebase = getFirebase();
  
      firebase.auth().signOut().then(() => {
        dispatch({ type: 'LOGOUT_SUCCESS' })
      });
    }
  }

  function makeToken() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 32; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  export const register = (newUser) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
      const firebase = getFirebase();
      const firestore = getFirestore();
      firebase.auth().createUserWithEmailAndPassword(
        newUser.email, 
        newUser.password
      ).then(resp => {
        return firestore.collection('users').doc(resp.user.uid).set({
          token: makeToken(), 
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          initials: newUser.firstName[0] + newUser.lastName[0],
          email: newUser.email,
          likedMoments: [],
          myMoments: [],
          lastUpdate: new Date(),
          joined: new Date()
        });
      }).then(() => {
        dispatch({ type: 'REGISTER_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'REGISTER_ERROR', err});
      });
    }
  }
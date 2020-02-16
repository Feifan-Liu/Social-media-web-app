const initState = {}

const commentReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_COMMENT_SUCCESS':
      console.log('create comment success');
      return state;
    case 'CREATE_COMMENT_ERROR':
      console.log('create commment error');
      return state;
    case 'DELETE_COMMENT_SUCCESS':
      console.log('delete comment success');
      return state;
    case 'DELETE_COMMENT_ERROR':
      console.log('delete commment error');
      return state;
    case 'UPDATE_COMMENT_SUCCESS':
      console.log('update comment success');
      return state;
    case 'UPDATE_COMMENT_ERROR':
      console.log('update comment error');
      return state;
    default:
      return state;
  }
};

export default commentReducer;
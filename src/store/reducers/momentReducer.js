const initState = {}

const momentReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_MOMENT_SUCCESS':
      console.log('create moment success');
      return state;
    case 'CREATE_MOMENT_ERROR':
      console.log('create moment error');
      return state;
    case 'DELETE_MOMENT_SUCCESS':
      console.log('delete moment success');
      return state;
    case 'DELETE_MOMENT_ERROR':
      console.log('delete moment error');
      return state;
    case 'UPDATE_MOMENT_SUCCESS':
      console.log('update moment success');
      return state;
    case 'UPDATE_MOMENT_ERROR':
      console.log('update moment error');
      return state;
    case 'SWITCH_COMMENT_SUCCESS':
      console.log('switch comment success');
      return state;
    case 'SWITCH_COMMENT_ERROR':
      console.log('switch comment error');
      return state;
    case 'LIKE_MOMENT_SUCCESS':
      console.log('like moment success');
      return state;
    case 'LIKE_MOMENT_ERROR':
      console.log('like moment error');
      return state;
    case 'DISLIKE_MOMENT_SUCCESS':
      console.log('dislike moment success');
      return state;
    case 'DISLIKE_MOMENT_ERROR':
      console.log('dislike moment error');
      return state;
    default:
      return state;
  }
};

export default momentReducer;
const initState = {}

const friendReducer = (state = initState, action) => {
    switch (action.type) {
        case 'ADD_FRIEND_SUCCESS':
            console.log('add friend success');
            return state;
        case 'ADD_FRIEND_ERROR':
            console.log('add friend error');
            return state;
        case 'DELETE_FRIEND_SUCCESS':
            console.log('delete friend success');
            return state;
        case 'DELETE_FRIEND_ERROR':
            console.log('delete friend error');
            return state;
        case 'DELETE_FRIENDREQUEST_SUCCESS':
            console.log('delete friend request success');
            return state;
        case 'DELETE_FRIENDREQUEST_ERROR':
            console.log('delete friend request error');
            return state;
        case 'ADD_FRIENDREQUEST_SUCCESS':
            console.log('add friend request success');
            return state;
        case 'ADD_FRIENDREQUEST_ERROR':
            console.log('add friend request error');
            return state;
        case 'DELETE_MESSAGE_SUCCESS':
            console.log('delete message success');
            return state;
        case 'DELETE_MESSAGE_ERROR':
            console.log('delete message error');
            return state;
        default:
            return state;
    }
};

export default friendReducer;
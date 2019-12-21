/*
Updates the state for comments after a given
action was done
*/

import {ADD_COMMENT, GET_ALL_COMMENTS, REPLY_TO_COMMENT, LIKE_COMMENT,
            LIKE_REPLY} from '../actions/types';

const initState = {
    commentsList: [],
}

export default function(state = initState, action){
    // determine which action was dispatched and "update" state accordingly
    switch(action.type){
        case ADD_COMMENT:
            return {
                ...state,
                commentsList: action.payload
            }
        case GET_ALL_COMMENTS:
            return {
                commentsList: action.payload
            }
        case REPLY_TO_COMMENT:
            return {
                commentsList: action.payload
            }
        case LIKE_COMMENT:
            return {
                commentsList: action.payload
            }
        case LIKE_REPLY:
            return {
                commentsList: action.payload
            }
        default:
            return state;
            
    }
}
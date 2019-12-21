/*
All actions that have to do with comments, including
commenting on posts, liking comments, etc
*/

import {ADD_COMMENT, GET_ALL_COMMENTS, REPLY_TO_COMMENT} from './types';

/*
Adds a comment to the post
*/
export const addComment = (commentData) => {
    // get the JSON from localstorage and add this comment
    let comments = JSON.parse(localStorage.getItem('comments'));
    // get next id to set the next comment to
    let currId = localStorage.getItem('currId');
    // if first comment, then set currId to 0
    if (!currId){
        currId = 0;
    }

    console.log("Fetched previous comments: ", comments)

    // add comment data or create new comments object to store
    if (comments){
        const newComment = {
            id: currId,
            content: commentData.content,
            posted: commentData.posted,
            replies: [],
            likes: 0,
        }
        comments.push(newComment);
    }
    else{
        comments = [{
            id: currId,
            content: commentData.content,
            posted: commentData.posted,
            replies: [],
            likes: 0,
        }]
    }
    console.log("Updated comments: ", comments);
    // set the comments and next id to local storage
    localStorage.setItem('comments', JSON.stringify(comments))
    localStorage.setItem('currId', ++currId);
    // dispatch to reducer to set state to include new comment
    return({
        type: ADD_COMMENT,
        payload: comments,
    })
}

/*
Gets all comments for a post
*/
export const getAllComments = () => {
    const comments = JSON.parse(localStorage.getItem('comments'));
    return({
        type: GET_ALL_COMMENTS,
        payload: comments,
    })
}

/*
Replies to a certain comment with the given reply
*/
export const replyToComment = (replyData, commentId) => {
    // get all comments and search for object with id
    const comments = JSON.parse(localStorage.getItem('comments'));

    const newReply = {
        content: replyData.content,
        posted: replyData.posted,
        likes: 0,
    }

    for (let i = 0; i < comments.length; i++){
        // found comment to reply to, so add reply
        if (parseInt(comments[i].id, 10) === parseInt(commentId, 10)){
            comments[i].replies.push(newReply);
            break;
        }
    }
    
    // store new changes in comment
    localStorage.setItem('comments', JSON.stringify(comments));
    // dispatch to reducer to set state to include new reply
    return({
        type: REPLY_TO_COMMENT,
        payload: comments,
    })
}
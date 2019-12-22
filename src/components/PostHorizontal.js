import React from 'react';
import os_banner from '../os_banner.jpg';
import person_icon from '../person-icon.png';
import heart_icon from '../heart.png';
import red_heart_icon from '../red-heart.png';
import {connect} from 'react-redux';
import {addComment, getAllComments, replyToComment, likeComment, likeReply} from '../redux/actions/commentActions';

import './PostHorizontal.css';

class PostHorizontal extends React.Component{
    constructor(){
        super();
        
        this.state = {
            comment: '',
        }

        this.onAddComment = this.onAddComment.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getSortedCommentsList = this.getSortedCommentsList.bind(this);
        this.getTimeFromNow = this.getTimeFromNow.bind(this);
        this.onReplyClick = this.onReplyClick.bind(this);
        this.onLikeClick = this.onLikeClick.bind(this);
        this.onReplyLikeClick = this.onReplyLikeClick.bind(this);
    }

    componentDidMount(){
        // when component mounts, get all comments and set state
        this.props.getAllComments();
    }

    /*
    Updates the comment text when the user is typing
    */
    onChange(evt){
        this.setState({
            comment: evt.target.value,
        })
    }

    /*
    Adds the comment to local storage via redux actions
    */
    onAddComment(evt){
        evt.preventDefault();

        if (this.state.comment.trim() == ''){
            return;
        }

        const newComment = {
            content: this.state.comment,
            posted: new Date(),
        }

        // empty the comment text
        this.setState({comment: ''});

        // add the comment to local storage and update state
        this.props.addComment(newComment);
    }

    /*
    Sorts a given list of comments by the dates they were posted
    */
    getSortedCommentsList(commentsList){
        commentsList.sort((a, b) => {
            a = new Date(a.posted);
            b = new Date(b.posted);
            return a > b ? -1 : a < b ? 1 : 0
        })
        return commentsList;
    }

    /*
    Allows the user to reply to a specific comment
    */
    onReplyClick(evt){
        console.log(evt.target.id);
        const commentId = evt.target.id;
        const newReply = {
            content: this.state.comment,
            posted: new Date(),
        }

        // only allow reply if the comment is not empty
        if (this.state.comment.trim() != ''){
            this.props.replyToComment(newReply, commentId);
        }

        // set the comment/reply text to empty
        this.setState({comment: ''});
    }

    onLikeClick(evt){
        evt.preventDefault();
        console.log(evt.target.id);
        const commentId = evt.target.id;
        this.props.likeComment(commentId);
    }

    onReplyLikeClick(commentId, replyId){
        this.props.likeReply(commentId, replyId);
    }

    /*
    Determines either the number of minutes, number of hours, or number
    of weeks from the current time that a comment was posted
    */
    getTimeFromNow(date){
        const currTime = new Date();
        const postedTime = new Date(date);
        // currently in seconds
        let timeDiff = Math.floor((currTime - postedTime) / 1000);
        // if less than a minute difference, show in seconds
        if (timeDiff < 60){
            return timeDiff + "s";
        }
        // get time diff in minutes and if less than 1 hour, show in minutes
        timeDiff = Math.floor(timeDiff / 60);
        if (timeDiff < 60){
            return timeDiff + "m";
        }
        // get time diff in hours and if less than a day, show in hours
        timeDiff = Math.floor(timeDiff / 60);
        if (timeDiff < 24){
            return timeDiff + "h";
        }
        // get time diff in days and if less than a week, show in days
        timeDiff = Math.floor(timeDiff / 24);
        if (timeDiff < 7){
            return timeDiff + "d";
        }
        // if a week or longer, show in weeks
        timeDiff = Math.floor(timeDiff / 7);
        return timeDiff + "w";
    }

    render(){
        const {commentsList} = this.props.comments;
        console.log(commentsList);
        //localStorage.clear();
        // get sorted comments list based on posted date
        const sortedComments = commentsList ? this.getSortedCommentsList(commentsList) : commentsList;

        // creating component of all comments
        const recentComments = sortedComments ? sortedComments.map(comment => 
            <div className='comment'>
                <div className='title-content horiz-flex-container'>
                    <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 10%'}}/>
                    <div className='comment-content horiz-flex-fill'>
                        <div className="horiz-flex-container">
                            <div className='comment' style={{flex:'0 0 80%'}}>
                                <div className='username-content horiz-flex-container'>
                                    <p className="username">username</p>
                                    <p className="comment">{comment.content}</p>
                                </div>
                                <div className='comment-stats horiz-flex-container'>
                                    <p className="reply-comment-stats">{this.getTimeFromNow(comment.posted)}</p>
                                    <div className='comment-likes reply-comment-stats'>
                                        {
                                            // show number of likes if there are any likes
                                            comment.likes > 0 ? 
                                                comment.likes === 1 ? 
                                                    <div className='numlikes'>
                                                        <p>{comment.likes} like</p>
                                                    </div> : 
                                                    <div className='numlikes'>
                                                        <p>{comment.likes} likes</p>
                                                    </div>
                                                : null
                                        }
                                    </div>
                                    <div className="reply-comment-stats">
                                        <button className="button" id={comment.id} onClick={this.onReplyClick}>Reply</button>
                                    </div>
                                </div>
                
                            </div>
                            <div className='like-button horiz-flex-fill'>
                                {
                                    // if already liked, can't like again
                                    comment.liked ? 
                                        <img className="heart" src={red_heart_icon} height='10px' width='10px'/> :
                                        <img className="heart" src={heart_icon} height='10px' width='10px'
                                            id={comment.id} onClick={this.onLikeClick}/>

                                }
                            </div>
                        </div>
                        {
                            // replies to this comment
                            comment.replies.length > 0 ? 
                                comment.replies.map(reply => 
                                    <div className='reply-content horiz-flex-container'>
                                        <div className='full-content horiz-flex-container'>
                                            <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 10%'}}/>
                                            <div className='content horiz-flex-fill'>
                                                <div className='username-content horiz-flex-container'>
                                                    <p className="username">username</p>
                                                    <p className="comment">{reply.content}</p>
                                                </div>
                                                <div className='horiz-flex-container'>
                                                    <p className="reply-comment-stats">{this.getTimeFromNow(reply.posted)}</p>
                                                    <div className="reply-comment-stats">
                                                        {
                                                            // show number of likes if there are any likes
                                                            reply.likes > 0 ? 
                                                                reply.likes === 1 ? 
                                                                    <div className='numlikes'>
                                                                        <p>{reply.likes} like</p>
                                                                    </div> : 
                                                                    <div className='numlikes'>
                                                                        <p>{reply.likes} likes</p>
                                                                    </div>
                                                                : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{flex:'1'}}>
                                            {
                                                // show likes button
                                                reply.liked ? 
                                                    <img className="heart" src={red_heart_icon} height='10px' width='10px' /> :
                                                    <img className="heart" src={heart_icon} height='10px' width='10px'
                                                        id={reply.id} onClick={() => this.onReplyLikeClick(comment.id, reply.id)}/>
                                            }
                                        </div>
                                    </div>       
                                ) : null
                        }
                    </div>
                </div>
            </div>
        ) : null;

        return(
            <div className='post-container horiz-flex-container'>
                <div className='post-content horiz-flex-container'>
                    <div className='post'>
                        <img className="post-img" src={os_banner} alt='open source' />
                    </div>
                    <div className='comments horiz-flex-fill'>
                        <div className='post-title horiz-flex-container'>
                            <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 5%'}}/>
                            <p className="horiz-flex-fill">os_ucsd</p>
                        </div>
                        <hr />
                        <div className='comments-section'>
                            <div className='comments-list'>
                                <div className='post-descr horiz-flex-container'>
                                    <img src={person_icon} height='40px' width='40px' style={{flex:'0 10%'}}/>
                                    <div className='poster-content horiz-flex-fill'>
                                        <p className='username'>os-ucsd</p>
                                        <p className="horiz-flex-fill">First Open Source @ UCSD GBM is today!</p>
                                    </div>
                                </div>
                                {recentComments}
                            </div>
                        </div>
                        <hr />
                        <form className="horiz-flex-container"onSubmit={this.onAddComment}>
                            <input className="comment-input" id='comment' type='text' value={this.state.comment} 
                                onChange={this.onChange}/> 
                            <input className="button" type='submit' value='Post'/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        comments: state.comments,
    }
}

export default connect(mapStateToProps, {addComment, getAllComments, replyToComment, 
                        likeComment, likeReply})(PostHorizontal);
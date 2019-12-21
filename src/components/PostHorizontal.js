import React from 'react';
import os_banner from '../os_banner.jpg';
import person_icon from '../person-icon.png';
import {connect} from 'react-redux';
import {addComment, getAllComments, replyToComment} from '../redux/actions/commentActions';

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

        // creating component of recent comments to only show 2 most recent
        const recentComments = sortedComments ? sortedComments.map(comment => 
            <div className='comment'>
                <div className='title-content' style={{display:'flex'}}>
                    <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 10%'}}/>
                    <div className='comment-content' style={{flex:'1'}}>
                        <div className='username-content' style={{display:'flex'}}>
                            <p style={{fontWeight:'bold', flex:'0 0 20%'}}>username</p>
                            <p style={{flex:'1', marginLeft:'7px'}}>{comment.content}</p>
                        </div>
                        <p>{this.getTimeFromNow(comment.posted)}</p>
                        <button id={comment.id} onClick={this.onReplyClick}>Reply</button>
                        {
                            comment.replies.length > 0 ? 
                                comment.replies.map(reply => 
                                    <div className='reply-content' style={{marginLeft:'20px', display:'flex'}}>
                                        <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 10%'}}/>
                                        <div className='content' style={{flex:'1'}}>
                                            <div className='username-content' style={{display:'flex'}}>
                                                <p style={{fontWeight:'bold', flex:'0 0 20%'}}>username</p>
                                                <p style={{flex:'1', marginLeft:'7px'}}>{reply.content}</p>
                                            </div>
                                            <p>{this.getTimeFromNow(reply.posted)}</p>
                                        </div>
                                    </div>       
                                ) : null
                        }
                    </div>
                </div>
            </div>
        ) : null;

        return(
            <div className='post-container'>
                <div className='post-content' style={{display:'flex'}}>
                    <div className='post' style={{flex:'0 0 70%'}}>
                        <img src={os_banner} alt='open source' width='700px'></img>
                    </div>
                    <div className='comments' style={{flex: 1}}>
                        <div className='post-title' style={{display:'flex'}}>
                            <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 5%'}}/>
                            <p style={{flex:'1'}}>os_ucsd</p>
                        </div>
                        <hr />
                        <div className='comments-section' style={{height:'70vh', overflow:'auto'}}>
                            <ul className='recent-comments-list'>
                                {recentComments}
                            </ul>
                        </div>
                        <form onSubmit={this.onAddComment}>
                            <input id='comment' type='text' value={this.state.comment} onChange={this.onChange} />
                            <input type='submit' value='Post' />
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

export default connect(mapStateToProps, {addComment, getAllComments, replyToComment})(PostHorizontal);
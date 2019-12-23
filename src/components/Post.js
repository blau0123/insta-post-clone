import React from 'react';
import os_banner from '../os_banner.jpg';
import person_icon from '../person-icon.png';
import {connect} from 'react-redux';
import {addComment, getAllComments} from '../redux/actions/commentActions';
import {Link} from 'react-router-dom';
import './css/Post.css';

class Post extends React.Component{
    constructor(){
        super();
        
        this.state = {
            comment: '',
        }

        this.onAddComment = this.onAddComment.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getSortedCommentsList = this.getSortedCommentsList.bind(this);
    }

    componentDidMount(){
        // when component mounts, get all comments and set state
        this.props.getAllComments();
    }

    onChange(evt){
        this.setState({
            comment: evt.target.value,
        })
    }

    onAddComment(evt){
        evt.preventDefault();

        const newComment = {
            content: this.state.comment,
            posted: new Date(),
        }
        // add the comment to local storage and update state
        this.props.addComment(newComment);
    }

    getSortedCommentsList(commentsList){
        commentsList.sort((a, b) => {
            a = new Date(a.posted);
            b = new Date(b.posted);
            return a > b ? -1 : a < b ? 1 : 0
        })
        return commentsList;
    }

    render(){
        const {commentsList} = this.props.comments;
        //localStorage.clear();
        // get sorted comments list based on posted date
        const sortedComments = commentsList ? this.getSortedCommentsList(commentsList) : null;

        // creating component of recent comments to only show 2 most recent
        const recentComments = sortedComments ? sortedComments.slice(0, 2).map(comment => 
            <div key={comment.id} className='comment horiz-flex-container'>
                <div className='user-comment horiz-flex-container'>
                    <p className="username">username</p>
                    <p className="recent-comment">{comment.content}</p>
                </div>
            </div>
        ) : null;

        return(
            <div className='post-container'>
                <div className='content-post'>
                    <div className='poster-user horiz-flex-container'>
                        <img src={person_icon} alt="user" height='40px' width='40px' style={{flex:'0 0 1%'}}/>
                        <p className="horiz-flex-fill">os_ucsd</p>
                    </div>
                    <img src={os_banner} alt='open source' style={{width:'50vw'}}></img>
                    <div className="horiz-flex-container">
                        <p className="post-username">os-ucsd</p>
                        <p className='descr post-descr'>First Open Source @ UCSD GBM is today!</p>
                    </div>
                    <div className='comments-section descr'>
                        {
                            commentsList ?
                                <Link to='/allcomments'>View all {commentsList.length} comments</Link> :
                                null
                        }
                        <div className='recent-comments-list'>
                            {recentComments}
                        </div>
                    </div>
                    <hr />
                    <form className="submit-comment" onSubmit={this.onAddComment}>
                        <input id='comment' type='text' value={this.state.comment} onChange={this.onChange}/>
                        <input className='button' type='submit' value='Post'/>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        comments: state.comments,
    }
}

export default connect(mapStateToProps, {addComment, getAllComments})(Post);
import React from 'react';
import os_banner from '../os_banner.jpg';
import {connect} from 'react-redux';
import {addComment, getAllComments} from '../redux/actions/commentActions';
import {Link} from 'react-router-dom';

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

        // get sorted comments list based on posted date
        const sortedComments = this.getSortedCommentsList(commentsList);
        console.log(sortedComments);

        // creating component of recent comments to only show 2 most recent
        const recentComments = commentsList ? commentsList.slice(0, 2).map(comment => 
            <div className='comment'>
                <p>{comment.content}</p>
            </div>
        ) : null;

        return(
            <div className='post-container'>
                <div className='post-content'>
                    <p>os_ucsd</p>
                    <img src={os_banner} alt='open source' height='400px'></img>
                    <p>First Open Source @ UCSD GBM is today!</p>
                    <div className='comments-section'>
                        <Link to='/allcomments'>View all {commentsList.length} comments</Link>
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
        )
    }
}

const mapStateToProps = state => {
    return {
        comments: state.comments,
    }
}

export default connect(mapStateToProps, {addComment, getAllComments})(Post);
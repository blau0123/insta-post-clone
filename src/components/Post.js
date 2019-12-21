import React from 'react';
import os_banner from '../os_banner.jpg';
import person_icon from '../person-icon.png';
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
            <div className='comment' style={{display:'flex'}}>
                <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 1%'}}/>
                <div className='user-comment' style={{display:'flex', flex:'1'}}>
                    <p style={{flex:'0 0 20%', fontWeight:'bold'}}>username</p>
                    <p style={{flex:'1'}}>{comment.content}</p>
                </div>
            </div>
        ) : null;

        return(
            <div className='post-container' style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div className='post-content' style={{width:'50vw', borderStyle:'solid'}}>
                    <div className='poster-user' style={{display:'flex'}}>
                        <img src={person_icon} height='40px' width='40px' style={{flex:'0 0 1%'}}/>
                        <p style={{flex:'1'}}>os_ucsd</p>
                    </div>
                    <img src={os_banner} alt='open source' style={{width:'50vw'}}></img>
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
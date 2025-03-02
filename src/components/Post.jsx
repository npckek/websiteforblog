import { useState } from "react";
import { Link } from "react-router-dom";
import Reactions from "./Reactions";
import Comments from "./Comments";
import PostContent from "./PostContent";
import PostMeta from "./PostMeta";
import PostTags from "./PostTags";
import PostActions from "./PostActions";
import PostMenu from "./PostMenu";

const Post = ({
                  post,
                  userVote,
                  handleReaction,
                  commentInput,
                  handleCommentChange,
                  handleAddComment,
                  handleEditPost,
                  handleSaveEdit,
                  handleDeletePost,
                  editingPostId,
                  editContent,
                  setEditContent,
                  currentUser,
                  handleTagClick,
                  handleToggleContent,
              }) => {
    return (
        <div key={post.id} className="p-4 mb-4 border rounded-lg flex flex-col ">

            <PostMenu
                post={post}
                currentUser={currentUser}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                editingPostId={editingPostId}
                handleSaveEdit={handleSaveEdit}
            />

            <PostContent
                post={post}
                editingPostId={editingPostId}
                editContent={editContent}
                setEditContent={setEditContent}
                handleToggleContent={handleToggleContent}
            />

            <PostMeta author={post.author} createdAt={post.createdAt} />
            <Reactions postId={post.id} likes={post.likes} dislikes={post.dislikes} userVote={userVote} handleReaction={handleReaction} />
            <PostTags tags={post.tags} handleTagClick={handleTagClick} />
            <Comments
                postId={post.id}
                comments={post.comments}
                commentInput={commentInput}
                handleCommentChange={handleCommentChange}
                handleAddComment={handleAddComment}
            />

            {currentUser === post.author && (
                <PostActions
                    post={post}
                    editingPostId={editingPostId}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    handleEditPost={handleEditPost}
                    handleSaveEdit={handleSaveEdit}
                    handleDeletePost={handleDeletePost}
                />
            )}
        </div>
    );
};

export default Post;

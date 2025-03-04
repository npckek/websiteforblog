import Reactions from "./Reactions";
import Comments from "./Comments";
import PostContent from "./PostContent";
import PostMeta from "./PostMeta";
import PostTags from "./PostTags";
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
                  isSubscribed,
                  handleSubscribe,
                  authorId,
                  handleCancelEdit,
              }) => {
    return (
        <div key={post.id} className="p-4 mb-4 border border-border rounded-lg flex flex-col bg-block w-full ">

            <PostMenu
                post={post}
                currentUser={currentUser}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                editingPostId={editingPostId}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
            />

            <PostContent
                post={post}
                editingPostId={editingPostId}
                editContent={editContent}
                setEditContent={setEditContent}
                handleSaveEdit={handleSaveEdit}
                handleToggleContent={handleToggleContent}
                handleEditPost={handleEditPost}
                handleCancelEdit={handleCancelEdit}
            />

            <PostMeta author={post.author} createdAt={post.createdAt} currentUser={currentUser} isSubscribed={isSubscribed} handleSubscribe={handleSubscribe} authorId={authorId}  />
            <Reactions postId={post.id} likes={post.likes} dislikes={post.dislikes} userVote={userVote} handleReaction={handleReaction} />
            <PostTags tags={post.tags} handleTagClick={handleTagClick} />
            <Comments
                postId={post.id}
                comments={post.comments}
                commentInput={commentInput}
                handleCommentChange={handleCommentChange}
                handleAddComment={handleAddComment}
            />
        </div>
    );
};

export default Post;

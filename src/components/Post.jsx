import { useState } from "react";
import { Link } from "react-router-dom";
import Reactions from "./Reactions";
import Comments from "./Comments";

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
              }) => {
    const [isContentExpanded, setIsContentExpanded] = useState(false);

    const handleToggleContent = () => {
        setIsContentExpanded(!isContentExpanded);
    };

    return (
        <div key={post.id} className="p-4 mb-4 border rounded-lg flex flex-col w-1/2">
            <h3 className="text-lg font-semibold">{post.title}</h3>

            {editingPostId === post.id ? (
                <textarea
                    className="w-full border rounded-lg p-2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                />
            ) : (
                <p className="text-gray-700 break-words">
                    {post.content.length > 100
                        ? isContentExpanded
                            ? post.content
                            : post.content.slice(0, 100) + "..."
                        : post.content}
                </p>
            )}

            {post.content.length > 100 && editingPostId !== post.id && (
                <button
                    onClick={handleToggleContent}
                    className="text-blue-500 hover:underline"
                >
                    {isContentExpanded ? "Скрыть" : "Показать полностью"}
                </button>
            )}

            <p className="text-sm text-gray-500">
                <Link to={`/user/${post.author}`}>
                    Автор: {post.author} | {new Date(post.createdAt).toLocaleString()}
                </Link>
            </p>

            <Reactions
                postId={post.id}
                likes={post.likes}
                dislikes={post.dislikes}
                userVote={userVote}
                handleReaction={handleReaction}
            />

            {post.tags.length > 0 && (
                <div className="mt-2">
                    <span className="text-gray-500">Теги:</span>{" "}
                    {post.tags.map((tag, index) => (
                        <span key={index} className="text-blue-500 cursor-pointer">
                            #{tag}{" "}
                        </span>
                    ))}
                </div>
            )}

            <Comments
                postId={post.id}
                comments={post.comments}
                commentInput={commentInput}
                handleCommentChange={handleCommentChange}
                handleAddComment={handleAddComment}
            />

            {currentUser === post.author && (
                <div className="mt-2">
                    {editingPostId === post.id ? (
                        <button
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => handleSaveEdit(post.id)}
                        >
                            Сохранить
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => handleEditPost(post)}
                        >
                            Редактировать
                        </button>
                    )}

                    <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeletePost(post.id)}
                    >
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
};

export default Post;

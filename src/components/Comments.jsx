import React from "react";

const Comments = ({ postId, comments, commentInput, handleCommentChange, handleAddComment }) => {
    return (
        <div className="mt-4">
            <input
                type="text"
                placeholder="Оставьте комментарий..."
                className="border rounded-lg p-2 w-full"
                value={commentInput || ""}
                onChange={(e) => handleCommentChange(postId, e.target.value)}
            />
            <button
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                onClick={() => handleAddComment(postId)}
                disabled={!commentInput}
            >
                Отправить
            </button>

            {/* Вывод комментариев */}
            {comments.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-md font-semibold">Комментарии:</h4>
                    {comments.map((comment, index) => (
                        <p key={index} className="text-gray-700 mt-1 border-l-4 pl-2 border-gray-300">
                            <strong>{comment.author}:</strong> {comment.text}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;

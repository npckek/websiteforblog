import React from "react";

const Comments = ({ postId, comments, commentInput, handleCommentChange, handleAddComment }) => {
    return (
        <div >
            {comments.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-md font-semibold text-text">Комментарии:</h4>
                    {comments.map((comment, index) => (
                        <p key={index} className="text-text mt-1 border-l-4 pl-2 border-gray-300">
                            <strong>{comment.author}:</strong> {comment.text}
                        </p>
                    ))}
                </div>
            )}
            <div className="flex justify-between">
                <input
                    type="text"
                    placeholder="Оставьте комментарий..."
                    className="border border-border rounded-lg p-2 w-full bg-block"
                    value={commentInput || ""}
                    onChange={(e) => handleCommentChange(postId, e.target.value)}
                />
                <button
                    className=" bg-blue-500 text-white p-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => handleAddComment(postId)}
                    disabled={!commentInput}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default Comments;

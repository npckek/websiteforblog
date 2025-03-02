import React from "react";

const EditPost = ({ post, currentUser, editingPostId, handleEditPost, handleSaveEdit, handleDeletePost }) => {
    if (currentUser !== post.author) return null;
    return (
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
    );
}

export default EditPost;
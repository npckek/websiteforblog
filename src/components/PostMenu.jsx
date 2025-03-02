import { useState } from "react";

const PostMenu = ({ post, currentUser, handleEditPost, handleDeletePost, editingPostId, handleSaveEdit }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute top-2 right-2">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">⋮</button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
                    {currentUser === post.author ? (
                        <>
                            {editingPostId === post.id ? (
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                    onClick={() => handleSaveEdit(post.id)}
                                >
                                    Сохранить
                                </button>
                            ) : (
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                    onClick={() => handleEditPost(post)}
                                >
                                    Редактировать
                                </button>
                            )}
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => handleDeletePost(post.id)}
                            >
                                Удалить
                            </button>
                        </>
                    ) : (
                        <div className="block w-full px-4 py-2 text-sm text-gray-400">Нет действий</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostMenu;
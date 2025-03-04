import { useState, useRef, useEffect } from "react";

const PostMenu = ({
                      post,
                      currentUser,
                      handleEditPost,
                      handleDeletePost,
                      editingPostId,
                      handleSaveEdit,
                      handleCancelEdit,
                  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleEscKey = (event) => {
        if (event.key === "Escape") {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscKey);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [isOpen]);

    return (
        <div className="flex justify-end" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">
                ...
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-36 bg-white border rounded shadow-md">
                    {currentUser === post.author ? (
                        <>
                            {editingPostId === post.id ? (
                                <>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100"
                                        onClick={() => handleSaveEdit(post.id)}
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                                        onClick={() => handleCancelEdit(post.id)}
                                    >
                                        Отмена
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                                    onClick={() => handleEditPost(post)}
                                >
                                    Редактировать
                                </button>
                            )}
                            <button
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
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

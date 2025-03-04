import React, {useRef, useEffect} from "react";

const PostContent = ({ post, editingPostId, editContent, setEditContent, handleToggleContent, handleSaveEdit, handleCancelEdit }) => {

    const textareaRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSaveEdit(post.id);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            handleCancelEdit(post.id);
        }
    };

    useEffect(() => {
        if (editingPostId === post.id) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [editingPostId, post.id]);

    useEffect(() => {
        if (editingPostId === post.id && textareaRef.current) {
            const textarea = textareaRef.current;

            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [editContent, editingPostId])

    return (

        <div className="mb-2">
            <h3 className="text-xl font-semibold text-text  ">{post.title}</h3>

            {editingPostId === post.id ? (
                <textarea
                    ref={textareaRef}
                    className=" w-full border border-border rounded-lg p-2 bg-block text-text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            ) : (
            <p className="text-text break-words w-full ">
                {post.content.length > 100
                    ? post.isContentExpanded
                        ? post.content
                        : post.content.slice(0, 100) + "..."
                    : post.content}
            </p>
            )}
            {post.content.length > 100 && (
                <button
                    onClick={() => handleToggleContent(post.id)}
                    className="text-blue-500 hover:underline "
                >
                    {post.isContentExpanded ? "Скрыть" : "Показать полностью"}
                </button>
            )}
        </div>
    );
};

export default PostContent;
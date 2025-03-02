const PostContent = ({ post, editingPostId, editContent, setEditContent, handleToggleContent }) => {
    return (

        <div className="mb-2">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-700 break-words">
                {post.content.length > 100
                    ? post.isContentExpanded
                        ? post.content
                        : post.content.slice(0, 100) + "..."
                    : post.content}
            </p>
            {post.content.length > 100 && (
                <button
                    onClick={() => handleToggleContent(post.id)}
                    className="text-blue-500 hover:underline"
                >
                    {post.isContentExpanded ? "Скрыть" : "Показать полностью"}
                </button>
            )}
        </div>
    );
};

export default PostContent;
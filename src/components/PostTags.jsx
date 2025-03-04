const PostTags = ({ tags, handleTagClick }) => {

    return (
        <div>
            {tags.length > 0 && (
                <div className="mt-2">
                    <span className="text-gray-500">Теги:</span>{" "}
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="text-blue-500 cursor-pointer"
                            onClick={() => handleTagClick(tag)}
                        >
                            #{tag}{" "}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostTags;
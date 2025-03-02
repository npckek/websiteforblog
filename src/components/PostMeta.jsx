import {Link} from "react-router-dom";

const PostMeta = ({ author, createdAt }) => {
    return (
        <div className="text-sm text-gray-500 mb-2">
            <Link to={`/user/${author}`}>Автор: {author}</Link> • <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
    );
};

export default PostMeta;
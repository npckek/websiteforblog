import {Link} from "react-router-dom";
import React from "react";

const PostMeta = ({ author, createdAt, currentUser, isSubscribed, handleSubscribe, authorId }) => {

    return (
        <div className="text-sm text-gray-500 mb-2  flex flex-row justify-between">
            <div>
                <Link to={`/user/${author}`}>Автор: {author}</Link> • <span>{new Date(createdAt).toLocaleString()}</span>
            </div>
            {currentUser && currentUser !== author &&(
                <button
                    className={`px-4 py-2 rounded ${isSubscribed ? "bg-red-500" : "bg-blue-500"} text-white`}
                    onClick={()=> handleSubscribe(authorId)}
                >
                    {isSubscribed ? "Отписаться" : "Подписаться"}
                </button>
            )}
        </div>
    );
};

export default PostMeta;
import React from "react";

const Reactions = ({ postId, likes, dislikes, userVote, handleReaction }) => {
    return (
        <div className="flex gap-4 mt-2 text-sm">
            <button
                onClick={() => handleReaction(postId, "like")}
                className={`${
                    userVote === "like"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-500 hover:text-green-700"
                }`}
                disabled={userVote === "like"}
            >
                ❤️ {likes}
            </button>
            <button
                onClick={() => handleReaction(postId, "dislike")}
                className={`${
                    userVote === "dislike"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                }`}
                disabled={userVote === "dislike"}
            >
                👎 {dislikes}
            </button>
        </div>
    );
};

export default Reactions;

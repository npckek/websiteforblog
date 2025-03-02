import { useState, useEffect } from "react";
import Reactions from "./Reactions";
import Comments from "./Comments";
import {Link} from "react-router-dom";

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [userVotes, setUserVotes] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [filterTags, setFilterTags] = useState('');
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPosts(storedPosts);

        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (storedUser) {
            setCurrentUser(storedUser);
            const storedVotes = JSON.parse(localStorage.getItem(`userVotes_${storedUser.name}`)) || {};
            setUserVotes(storedVotes);
        }

        const storedSortOrder = localStorage.getItem("sortOrder");
        if (storedSortOrder) {
            setSortOrder(storedSortOrder);
        }

        const storedTags = localStorage.getItem("filterTags");
        if (storedTags) {
            setFilterTags(storedTags);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`userVotes_${currentUser.name}`, JSON.stringify(userVotes));
        }
    }, [userVotes, currentUser]);

    useEffect(() => {
        localStorage.setItem("sortOrder", sortOrder);
    }, [sortOrder]);

    useEffect(() => {
        localStorage.setItem("filterTags", filterTags);
    }, [filterTags]);

    const handleReaction = (postId, type) => {
        const currentVote = userVotes[postId];
        const updatedPosts = [...posts];

        if (currentVote === type) {
            updatedPosts.forEach(post => {
                if (post.id === postId) {
                    post[type === 'like' ? 'likes' : 'dislikes'] -= 1;
                }
            });
            const updatedVotes = { ...userVotes };
            delete updatedVotes[postId];
            setUserVotes(updatedVotes);
        } else {
            updatedPosts.forEach(post => {
                if (post.id === postId) {
                    if (type === "like") {
                        post.likes += 1;
                        post.dislikes -= currentVote === "dislike" ? 1 : 0;
                    } else {
                        post.dislikes += 1;
                        post.likes -= currentVote === "like" ? 1 : 0;
                    }
                }
            });
            const updatedVotes = { ...userVotes, [postId]: type };
            setUserVotes(updatedVotes);
        }

        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
    };

    const handleCommentChange = (postId, text) => {
        setCommentInputs((prev) => ({
            ...prev,
            [postId]: text,
        }));
    };

    const handleAddComment = (postId) => {
        if (!commentInputs[postId]?.trim() || !currentUser) return;

        const newComment = {
            author: currentUser.name,
            text: commentInputs[postId].trim(),
        };

        const updatedPosts = posts.map((post) =>
            post.id === postId
                ? { ...post, comments: [...post.comments, newComment] }
                : post
        );

        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));

        setCommentInputs((prev) => ({
            ...prev,
            [postId]: "",
        }));
    };

    const handleTagFilter = (e) => {
        setFilterTags(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleTagClick = (tag) => {
        // При клике на тег обновляем фильтр
        setFilterTags(tag);
    };

    // Фильтрация по тегам
    const filteredPosts = posts.filter(post => {
        if (!filterTags.trim()) return true; // Если фильтр пустой, показываем все
        const tags = filterTags.split(',').map(tag => tag.trim().toLowerCase());
        return post.tags.some(tag => tags.includes(tag.toLowerCase()));
    });

    // Сортировка по дате
    const sortedPosts = filteredPosts.sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    const handleToggleContent = (postId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId ? { ...post, isContentExpanded: !post.isContentExpanded } : post
        );
        setPosts(updatedPosts);
    };

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 w-">Посты</h2>

            {/* Фильтрация по тегам */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Фильтровать по тегам (через запятую)"
                    className="border rounded-lg p-2"
                    value={filterTags}
                    onChange={handleTagFilter}
                />
            </div>

            {/* Сортировка */}
            <div className="mb-4">
                <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="border rounded-lg p-2"
                >
                    <option value="newest">От новых к старым</option>
                    <option value="oldest">От старых к новым</option>
                </select>
            </div>

            {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                    <div key={post.id} className="p-4 mb-4 border rounded-lg flex flex-col w-1/2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>

                        {/* Контент поста с ограничением 100 символов */}
                        <p className="text-gray-700 break-words ">
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

                        <p className="text-sm text-gray-500">
                            <Link to={`/user/${post.author}`}>Автор: {post.author} | {new Date(post.createdAt).toLocaleString()}</Link>
                        </p>

                        {/* Reactions component */}
                        <Reactions
                            postId={post.id}
                            likes={post.likes}
                            dislikes={post.dislikes}
                            userVote={userVotes[post.id]}
                            handleReaction={handleReaction}
                        />

                        {/* Теги */}
                        <div>
                            {post.tags.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-gray-500">Теги:</span>{" "}
                                    {post.tags.map((tag, index) => (
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

                        {/* Comments component */}
                        <Comments
                            postId={post.id}
                            comments={post.comments}
                            commentInput={commentInputs[post.id]}
                            handleCommentChange={handleCommentChange}
                            handleAddComment={handleAddComment}
                        />
                    </div>
                ))
            ) : (
                <p>Постов пока нет или не найдено по указанным фильтрам.</p>
            )}
        </div>
    );
};

export default PostsList;

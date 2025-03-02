import { useState, useEffect } from "react";
import Reactions from "./Reactions";
import Comments from "./Comments";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import PostMeta from "./PostMeta";
import PostContent from "./PostContent";
import PostTags from "./PostTags";
import PostActions from "./PostActions";

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [userVotes, setUserVotes] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [filterTags, setFilterTags] = useState('');
    const [sortOrder, setSortOrder] = useState("newest");
    const [subscribedAuthors, setSubscribedAuthors] = useState([]);
    const [showSubscribedPosts, setShowSubscribedPosts] = useState(false);

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        console.log("Stored posts:", storedPosts);
        setPosts(storedPosts);

        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (storedUser) {
            console.log("Stored user:", storedUser);
            setCurrentUser(storedUser);
            const storedVotes = JSON.parse(localStorage.getItem(`userVotes_${storedUser.name}`)) || {};
            setUserVotes(storedVotes);

            // Получаем подписки пользователя
            let subscriptions = [];
            if (storedUser.subs) {
                if (typeof storedUser.subs === 'string') {
                    subscriptions = storedUser.subs.split(','); // если это строка
                } else if (Array.isArray(storedUser.subs)) {
                    subscriptions = storedUser.subs; // если это массив
                }
            }
            console.log("User subscriptions:", subscriptions);
            setSubscribedAuthors(subscriptions);
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

    // Фильтрация постов по подпискам и тегам
    const filteredPosts = showSubscribedPosts
        ? posts.filter(post => {
            // Проверка на подписки
            if (!currentUser || !currentUser.subs) return false;
            const subscribedAuthors = currentUser.subs;
            const isSubscribed = subscribedAuthors.includes(post.authorId);

            // Проверка на теги
            const isMatchingTags =
                !filterTags.trim() || post.tags.some((tag) => filterTags.split(',').map((t) => t.trim().toLowerCase()).includes(tag.toLowerCase()));

            return isSubscribed && isMatchingTags;
        })
        : posts.filter(post => {
            // Если фильтр подписок не включен, просто фильтруем по тегам
            const isMatchingTags =
                !filterTags.trim() || post.tags.some((tag) => filterTags.split(',').map((t) => t.trim().toLowerCase()).includes(tag.toLowerCase()));

            return isMatchingTags;
        });


    // Сортировка по дате
    const sortedPosts = filteredPosts.sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    const handleTagFilter = (e) => {
        setFilterTags(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleTagClick = (tag) => {
        setFilterTags(tag);
    };

    const handleToggleContent = (postId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId ? { ...post, isContentExpanded: !post.isContentExpanded } : post
        );
        setPosts(updatedPosts);
    };

    // Функция для добавления нового поста
    const handlePostCreate = (newPost) => {
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
    };

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 w-">Посты</h2>
            <CreatePost onPostCreate={handlePostCreate} />
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

            <button
                onClick={() => setShowSubscribedPosts(prevState => !prevState)}
                className="mb-4 p-2 bg-blue-500 text-white rounded"
            >
                {showSubscribedPosts ? "Показать все посты" : "Показать посты подписок"}
            </button>

            {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <div key={post.id} className="p-4 mb-4 border rounded-lg flex flex-col w-1/2">


                        <PostContent
                            post={post}
                            handleToggleContent={handleToggleContent}
                        />

                        <PostMeta post={post} author={post.author} createdAt={post.createdAt} />

                        {/* Reactions component */}
                        <Reactions
                            postId={post.id}
                            likes={post.likes}
                            dislikes={post.dislikes}
                            userVote={userVotes[post.id]}
                            handleReaction={handleReaction}
                        />

                        {/* Теги */}

                        <PostTags tags={post.tags} handleTagClick={handleTagClick} />


                        {/*<div>*/}
                        {/*    {post.tags.length > 0 && (*/}
                        {/*        <div className="mt-2">*/}
                        {/*            <span className="text-gray-500">Теги:</span>{" "}*/}
                        {/*            {post.tags.map((tag, index) => (*/}
                        {/*                <span*/}
                        {/*                    key={index}*/}
                        {/*                    className="text-blue-500 cursor-pointer"*/}
                        {/*                    onClick={() => handleTagClick(tag)}*/}
                        {/*                >*/}
                        {/*        #{tag}{" "}*/}
                        {/*    </span>*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</div>*/}

                        {/* Comments component */}
                        <Comments
                            postId={post.id}
                            comments={post.comments}
                            commentInput={commentInputs[post.id]}
                            handleCommentChange={handleCommentChange}
                            handleAddComment={handleAddComment}
                        />

                        {currentUser === post.author && (
                            <PostActions
                                post={post}
                                // editingPostId={editingPostId}
                                // editContent={editContent}
                                // setEditContent={setEditContent}
                                // handleEditPost={handleEditPost}
                                // handleSaveEdit={handleSaveEdit}
                                // handleDeletePost={handleDeletePost}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p>Постов пока нет или не найдено по указанным фильтрам.</p>
            )}
        </div>
    );
};

export default PostsList;

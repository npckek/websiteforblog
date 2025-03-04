import React, { useState } from "react";
import {Link, useParams} from "react-router-dom";
import Post from "../components/Post";
import GlobalEffect from "../hooks/Effect";
import Switcher from "../components/Switcher";

const User = () => {
    const { authorName } = useParams();

    const [commentInputs, setCommentInputs] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [isSubscribed, setIsSubscribed] = useState();

    const {
        posts,
        users,
        authorId,
        setPosts,
        currentUser,
        setCurrentUser,
        userVotes,
        setUserVotes,
        sortOrder,
        setSortOrder,
        filterTags,
        subscribedAuthors,
        setFilterTags
    } = GlobalEffect();

    const authorPosts = posts.filter(post => post.author === authorName);

    const filteredPosts = authorPosts.filter(post => {
        if (!filterTags.trim()) return true;

        const tagFilter = filterTags.toLowerCase().split(",").map(tag => tag.trim());
        return post.tags.some(tag => tagFilter.includes(tag.toLowerCase()));
    });

    const sortedPosts = [...filteredPosts].sort((a, b) =>
        sortOrder === "newest"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt)
    );



    const handleSubscribe = () => {
        if (!currentUser || !authorId) return;

        let updatedSubs = [...currentUser.subs];

        if (isSubscribed) {
            updatedSubs = updatedSubs.filter(id => id !== authorId);
        } else {
            updatedSubs.push(authorId);
        }

        const updatedUser = { ...currentUser, subs: updatedSubs };
        setCurrentUser(updatedUser);
        setIsSubscribed(!isSubscribed);

        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    const handleTagFilter = (e) => {
        setFilterTags(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };


    const clearTags = () => {
        setFilterTags("");
    };


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

    const handleToggleContent = (postId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId ? { ...post, isContentExpanded: !post.isContentExpanded } : post
        );
        setPosts(updatedPosts);
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

    const handleDeletePost = (postId) => {
        const allPosts = JSON.parse(localStorage.getItem("posts")) || [];

        const updatedPosts = allPosts.filter(post => !(post.id === postId && post.author === authorName));

        setPosts(updatedPosts.filter(post => post.author === authorName));
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
    };

    const handleTagClick = (tag) => {
        setFilterTags(tag);
    };

    const handleEditPost = (post) => {
        setEditingPostId(post.id);
        setEditContent(post.content);
    };

    const handleSaveEdit = (postId) => {
        const allPosts = JSON.parse(localStorage.getItem("posts")) || [];

        const updatedPosts = allPosts.map(post =>
            post.id === postId ? { ...post, content: editContent } : post
        );

        setPosts(updatedPosts.filter(post => post.author === authorName));
        localStorage.setItem("posts", JSON.stringify(updatedPosts));

        setEditingPostId(null);
    };


    return (
        <div className='flex flex-col items-center'>
            <header className=' p-4 w-full flex flex-row justify-between'>
                <Link to={`/feed`} className='text-text text-xl font-bold'> Вернуться назад </Link>
                <h2 className="text-xl font-bold text-text absolute left-1/2 -translate-x-1/2">Посты {authorName}</h2>
                <Switcher/>
            </header>
            <div className='mb-4 flex flex-row'>
                <div className="px-1">
                    <input
                        type="text"
                        placeholder="Фильтровать по тегам (через запятую)"
                        className="border border-border rounded-lg p-2 bg-block"
                        value={filterTags}
                        onChange={handleTagFilter}
                    />
                    <button className=" p-2 bg-blue-500 text-white rounded" onClick={clearTags} >
                        Empty tags
                    </button>
                </div>
                <div className="px-1">
                    <select
                        value={sortOrder}
                        onChange={handleSortChange}
                        className="border border-border bg-block rounded-lg p-2 h-full text-text"
                    >
                        <option value="newest">От новых к старым</option>
                        <option value="oldest">От старых к новым</option>
                    </select>
                </div>
            </div>
            {sortedPosts.length > 0 ? (
                sortedPosts.map(post => (
                    <div key={post.id} className='flex flex-col items-center w-1/2'>
                        <Post
                            post={post}
                            userVote={userVotes[post.id]}
                            handleReaction={handleReaction}
                            commentInput={commentInputs[post.id]}
                            handleCommentChange={handleCommentChange}
                            handleAddComment={handleAddComment}
                            currentUser={currentUser?.name}
                            handleToggleContent={handleToggleContent}
                            handleTagClick={handleTagClick}
                            editingPostId={editingPostId}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            handleEditPost={handleEditPost}
                            handleSaveEdit={handleSaveEdit}
                            handleDeletePost={handleDeletePost}
                            isSubscribed={subscribedAuthors.includes(post.authorId)}
                            handleSubscribe={handleSubscribe}
                            authorId={post.authorId}
                        />
                    </div>


                ))
            ) : (
                <p>У этого автора пока нет постов.</p>
            )}
        </div>
    );
};

export default User;

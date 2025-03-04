import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import Post from "./Post";
import GlobalEffect from "../hooks/Effect";

const PostsList = () => {
    const [commentInputs, setCommentInputs] = useState({});
    const [showSubscribedPosts, setShowSubscribedPosts] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null); // ID редактируемого поста
    const [editContent, setEditContent] = useState(""); // Содержимое редактируемого поста


    const {
        posts,
        users,
        setUsers,
        setPosts,
        currentUser,
        setCurrentUser,
        userVotes,
        setUserVotes,
        sortOrder,
        setSortOrder,
        filterTags,
        subscribedAuthors,
        setSubscribedAuthors,
        setFilterTags
    } = GlobalEffect();


    useEffect(() => {
        if (currentUser) {
            setSubscribedAuthors(currentUser.subs);
        }
    }, [currentUser]);


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

    const filteredPosts = showSubscribedPosts
        ? posts.filter(post => {
            if (!currentUser || !Array.isArray(currentUser.subs)) return false;
            const subscribedAuthors = currentUser.subs;
            const isSubscribed = subscribedAuthors.includes(post.authorId);

            const tagFilter = filterTags ? filterTags.trim().toLowerCase() : "";
            const postTags = Array.isArray(post.tags) ? post.tags : [];
            const isMatchingTags = !tagFilter || postTags.some(tag => tagFilter.split(',').includes(tag.toLowerCase()));

            return isSubscribed && isMatchingTags;
        })
        : posts.filter(post => {
            const tagFilter = filterTags ? filterTags.trim().toLowerCase() : "";
            const postTags = Array.isArray(post.tags) ? post.tags : [];
            const isMatchingTags = !tagFilter || postTags.some(tag => tagFilter.split(',').includes(tag.toLowerCase()));

            return isMatchingTags;
        });


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

    const clearTags = () => {
        setFilterTags("");
    };

    const handleToggleContent = (postId) => {
        const updatedPosts = posts.map(post =>
            post.id === postId ? { ...post, isContentExpanded: !post.isContentExpanded } : post
        );
        setPosts(updatedPosts);
    };

    const handlePostCreate = (newPost) => {
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
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

        setPosts(updatedPosts.filter(post => post.author));
        localStorage.setItem("posts", JSON.stringify(updatedPosts));

        setEditingPostId(null);
    };

    const handleDeletePost = (postId) => {
        const allPosts = JSON.parse(localStorage.getItem("posts")) || [];

        // Оставляем в списке все посты, кроме удаляемого
        const updatedPosts = allPosts.filter(post => !(post.id === postId && post.author));

        setPosts(updatedPosts.filter(post => post.author));
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
    };


    const handleSubscribe = (authorId) => {
        if (!currentUser || !authorId) return;

        let updatedSubs = [...(currentUser.subs || [])];

        if (subscribedAuthors.includes(authorId)) {
            updatedSubs = updatedSubs.filter(id => id !== authorId);
        } else {
            updatedSubs.push(authorId);
        }

        const updatedUser = { ...currentUser, subs: updatedSubs };
        setCurrentUser(updatedUser);
        setSubscribedAuthors(updatedSubs);

        const userExists = users.some(user => user.id === currentUser.id);

        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );


        setUsers(updatedUsers);

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        localStorage.setItem("users", JSON.stringify(updatedUsers));

    };

    const handleCancelEdit = (postId) => {
        setEditingPostId(null);
        setEditContent("");
    };





    return (
        <div className=" flex flex-col items-center bg-background">
            <div className=" w-full flex flex-col items-center">
                <div className='w-1/2'>
                    <CreatePost onPostCreate={handlePostCreate}/>
                </div>
            </div>
            <div className=" flex mb-4">
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
                <div className="px-1">
                    <button
                        onClick={() => setShowSubscribedPosts(prevState => !prevState)}
                        className=" p-2 bg-blue-500 text-white rounded"
                    >
                        {showSubscribedPosts ? "Показать все посты" : "Показать посты подписок"}
                    </button>
                </div>

            </div>
<div className=" w-full flex flex-col items-center">
    {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
            <div key={post.id} className=" w-1/2 mb-4 flex flex-col items-center">
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
                    handleCancelEdit={handleCancelEdit}
                />
            </div>
        ))
    ) : (
        <p className='text-text'>Постов пока нет или не найдено по указанным фильтрам.</p>
    )}
</div>

        </div>
    );
};

export default PostsList;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Reactions from "../components/Reactions";
import Comments from "../components/Comments";
import PostActions from "../components/PostActions";

const User = () => {
    const { authorName } = useParams(); // Получаем имя автора из URL

    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userVotes, setUserVotes] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [filterTags, setFilterTags] = useState('');
    const [editingPostId, setEditingPostId] = useState(null); // ID редактируемого поста
    const [editContent, setEditContent] = useState(""); // Содержимое редактируемого поста
    const [isSubscribed, setIsSubscribed] = useState();
    const [users, setUsers] = useState([]);
    const [authorId, setAuthorId] = useState(''); // ID автора


    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const filteredPosts = storedPosts.filter(post => post.author === authorName);
        setPosts(filteredPosts);

        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);

        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (storedUser) {
            setCurrentUser(storedUser);

            // Находим ID автора
            const author = storedUsers.find(user => user.name === authorName);
            if (author) {
                setAuthorId(author.id);

                // Проверяем подписан ли текущий пользователь на автора
                setIsSubscribed(storedUser.subs.includes(author.id));

            }
        }

    }, [authorName]);


    // const storedUsers = JSON.parse(localStorage.getItem("users"));
    // const users = storedUsers.filter(users => users.id === storedUsers.id);
    // if (storedUsers) {
    //     console.log("ID пользователя:", storedUsers.id);
    // }

    // Функция подписки
    const handleSubscribe = () => {
        if (!currentUser || !authorId) return;

        let updatedSubs = [...currentUser.subs];

        if (isSubscribed) {
            // Удаляем подписку
            updatedSubs = updatedSubs.filter(id => id !== authorId);
        } else {
            // Добавляем подписку
            updatedSubs.push(authorId);
        }

        // Обновляем текущего пользователя
        const updatedUser = { ...currentUser, subs: updatedSubs };
        setCurrentUser(updatedUser);
        setIsSubscribed(!isSubscribed);

        // Обновляем массив пользователей
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        // Сохраняем в localStorage
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };



    // Реакции на публикации, посмотреть что с ними не так...
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

    // Функция для удаления поста
    const handleDeletePost = (postId) => {
        const allPosts = JSON.parse(localStorage.getItem("posts")) || [];

        // Оставляем в списке все посты, кроме удаляемого
        const updatedPosts = allPosts.filter(post => !(post.id === postId && post.author === authorName));

        setPosts(updatedPosts.filter(post => post.author === authorName)); // Обновляем состояние
        localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Обновляем localStorage
    };

    const handleTagClick = (tag) => {
        // При клике на тег обновляем фильтр
        setFilterTags(tag);
    };

    // Начало редактирования поста
    const handleEditPost = (post) => {
        setEditingPostId(post.id);
        setEditContent(post.content);
    };

    // Сохранение отредактированного поста
    const handleSaveEdit = (postId) => {
        const allPosts = JSON.parse(localStorage.getItem("posts")) || [];

        // Обновляем только нужный пост в общем списке
        const updatedPosts = allPosts.map(post =>
            post.id === postId ? { ...post, content: editContent } : post
        );

        setPosts(updatedPosts.filter(post => post.author === authorName)); // Оставляем только посты этого автора в состоянии
        localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Сохраняем обновленные посты

        setEditingPostId(null); // Выход из режима редактирования
    };


    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Посты {authorName}</h2>

            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post.id} className="p-4 border rounded-lg w-1/2">
                        <h3 className="font-semibold">{post.title}</h3>
                        {/*Подписка на пользователя*/}
                        {currentUser && currentUser.name !== authorName && (
                            <button
                                className={`px-4 py-2 rounded ${isSubscribed ? "bg-red-500" : "bg-blue-500"} text-white`}
                                onClick={handleSubscribe}
                            >
                                {isSubscribed ? "Отписаться" : "Подписаться"}
                            </button>
                        )}{
                            /* Редактируемый текст */}
                        {editingPostId === post.id ? (
                            <textarea
                                className="w-full border rounded-lg p-2"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        ) : (
                            <p>{post.content}</p>
                        )}


                        <p className="text-sm text-gray-500">
                            Автор: {post.author}
                        </p>

                        {/*<Reactions*/}
                        {/*    postId={post.id}*/}
                        {/*    likes={post.likes}*/}
                        {/*    dislikes={post.dislikes}*/}
                        {/*    userVote={userVotes[post.id]}*/}
                        {/*    handleReaction={handleReaction}*/}
                        {/*/>*/}

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


                        <Comments
                            postId={post.id}
                            comments={post.comments}
                            commentInput={commentInputs[post.id]}
                            handleCommentChange={handleCommentChange}
                            handleAddComment={handleAddComment}
                        />

                        {currentUser.id === post.authorId && (
                            <PostActions
                                post={post}
                                editingPostId={editingPostId}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                handleEditPost={handleEditPost}
                                handleSaveEdit={handleSaveEdit}
                                handleDeletePost={handleDeletePost}
                            />
                        )}
                         {/*Показываем кнопки, если пользователь совпадает*/}
                        {/*{currentUser.id === post.authorId && (*/}
                        {/*    <div className="mt-2">*/}
                        {/*        {editingPostId === post.id ? (*/}
                        {/*            <button*/}
                        {/*                className="bg-green-500 text-white px-2 py-1 rounded mr-2"*/}
                        {/*                onClick={() => handleSaveEdit(post.id)}*/}
                        {/*            >*/}
                        {/*                Сохранить*/}
                        {/*            </button>*/}
                        {/*        ) : (*/}
                        {/*            <button*/}
                        {/*                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"*/}
                        {/*                onClick={() => handleEditPost(post)}*/}
                        {/*            >*/}
                        {/*                Редактировать*/}
                        {/*            </button>*/}
                        {/*        )}*/}

                        {/*        <button*/}
                        {/*            className="bg-red-500 text-white px-2 py-1 rounded"*/}
                        {/*            onClick={() => handleDeletePost(post.id)}*/}
                        {/*        >*/}
                        {/*            Удалить*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                ))
            ) : (
                <p>У этого автора пока нет постов.</p>
            )}
        </div>
    );
};

export default User;

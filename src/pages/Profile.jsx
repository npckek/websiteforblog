import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
    const { authorName } = useParams(); // Получаем имя автора из URL

    const [users, setUsers] = useState([]); // Все пользователи
    const [currentUser, setCurrentUser] = useState(null); // Текущий пользователь
    const [authorId, setAuthorId] = useState(null); // ID автора
    const [isSubscribed, setIsSubscribed] = useState(false); // Подписка

    useEffect(() => {
        // Загружаем пользователей из localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);

        // Получаем текущего пользователя
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

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Профиль {authorName}</h2>

            {/* Кнопка подписки */}
            {currentUser && currentUser.name !== authorName && (
                <button
                    className={`px-4 py-2 rounded ${isSubscribed ? "bg-red-500" : "bg-blue-500"} text-white`}
                    onClick={handleSubscribe}
                >
                    {isSubscribed ? "Отписаться" : "Подписаться"}
                </button>
            )}
        </div>
    );
};

export default Profile;

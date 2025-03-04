import { useEffect, useState } from "react";

const GlobalEffect = () => {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userVotes, setUserVotes] = useState({});
    const [subscribedAuthors, setSubscribedAuthors] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState();
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterTags, setFilterTags] = useState('');
    const [users, setUsers] = useState([]);
    const [authorId, setAuthorId] = useState(''); // ID автора


    const getStoredData = (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    };


    useEffect(() => {
        const storedPosts = getStoredData("posts") || [];
        setPosts(storedPosts);

        const storedUsers = getStoredData("users");

        if (storedUsers && Array.isArray(storedUsers) && storedUsers.length > 0) {
            setUsers(storedUsers);
        }




        const storedUser = getStoredData("currentUser");

        if (storedUser) {
            setCurrentUser(storedUser);

            const storedSubs = storedUser.subs ? Array.isArray(storedUser.subs)
                    ? storedUser.subs
                    : storedUser.subs.split(",")
                : [];

            setSubscribedAuthors(storedSubs);
        }

        if (storedUser) {
            setCurrentUser(storedUser);

            const storedVotes = getStoredData(`userVotes_${storedUser.name}`) || {};
            setUserVotes(storedVotes);

            let subscriptions = [];
            if (storedUser.subs) {
                subscriptions = Array.isArray(storedUser.subs)
                    ? storedUser.subs
                    : storedUser.subs.split(",");
            }
            setSubscribedAuthors(subscriptions);

            // const author = storedUsers.find(user => user.name === author);
            // if (author) {
            //     setAuthorId(author.id);
            //
            //     // Проверяем подписан ли текущий пользователь на автора
            //     setIsSubscribed(storedUser.subs.includes(author.id));
            //
            // }
        }

        const storedSortOrder = getStoredData("sortOrder");
        if (storedSortOrder) {
            setSortOrder(storedSortOrder);
        } else {
            setSortOrder("newest"); // Установите значение по умолчанию
        }

        const storedTags = getStoredData("filterTags");
        if (storedTags) {
            setFilterTags(storedTags);
        }


    }, []);

    // Пример функции для загрузки текущего пользователя
    const loadUser = () => {
        // Здесь может быть логика для загрузки пользователя из localStorage, API и т.д.
        const user = localStorage.getItem("currentUser");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    };

    const logout = () => {
        // Очистка данных пользователя из состояния
        setCurrentUser(null);

        // Очистка данных пользователя из localStorage (или другого хранилища)
        localStorage.removeItem("currentUser");

        // Если необходимо, можно отправить запрос на сервер для завершения сеанса
        // fetch('/api/logout', { method: 'POST' });
    };

    useEffect(() => {
        loadUser();
    }, []);



    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    }, [currentUser]);

    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem("users", JSON.stringify(users));
        }
    }, [users]);


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


    return {
        posts,
        users,
        setUsers,
        authorId,
        setAuthorId,
        setPosts,
        currentUser,
        setCurrentUser,
        userVotes,
        setUserVotes,
        subscribedAuthors,
        setSubscribedAuthors,
        sortOrder,
        setSortOrder,
        filterTags,
        setFilterTags,
        logout,
    };
};

export default GlobalEffect;

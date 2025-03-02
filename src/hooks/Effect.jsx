import {useEffect, useState} from "react";

const GlobalEffect = () => {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [userVotes, setUserVotes] = useState({});
    const [subscribedAuthors, setSubscribedAuthors] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterTags, setFilterTags] = useState([]);

    const getStoredData = (key) => {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null; // Проверяем на null или пустую строку
            return JSON.parse(data);
        } catch (error) {
            console.error(`Ошибка парсинга JSON для ключа "${key}":`, error);
            return null;
        }
    };

    useEffect(() => {
        const storedPosts = getStoredData("posts") || [];
        console.log("Stored posts:", storedPosts);
        setPosts(storedPosts);

        const storedUser = getStoredData("currentUser");
        if (storedUser) {
            console.log("Stored user:", storedUser);
            setCurrentUser(storedUser);

            const storedVotes = getStoredData(`userVotes_${storedUser.name}`) || {};
            setUserVotes(storedVotes);

            let subscriptions = [];
            if (storedUser.subs) {
                subscriptions = Array.isArray(storedUser.subs)
                    ? storedUser.subs
                    : storedUser.subs.split(",");
            }
            console.log("User subscriptions:", subscriptions);
            setSubscribedAuthors(subscriptions);
        }
        //
        // setSortOrder(getStoredData("sortOrder") || "");
        // setFilterTags(getStoredData("filterTags") || "");
    }, []);



    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPosts(storedPosts);

        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (storedUser) {
            setCurrentUser(storedUser);
            const storedVotes = JSON.parse(localStorage.getItem(`userVotes_${storedUser.name}`)) || {};
            setUserVotes(storedVotes);

            let subscriptions = [];
            if (storedUser.subs) {
                subscriptions = typeof storedUser.subs === 'string'
                    ? storedUser.subs.split(',')
                    : storedUser.subs;
            }
            setSubscribedAuthors(subscriptions);
        }

        const storedSortOrder = localStorage.getItem("sortOrder");
        if (storedSortOrder) {
            setSortOrder(storedSortOrder);
        }

        const storedTags = JSON.parse(localStorage.getItem("filterTags")) || [];
        setFilterTags(storedTags);
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`userVotes_${currentUser.name}`, JSON.stringify(userVotes));
        }
    }, [userVotes, currentUser]);

    useEffect(() => {
        localStorage.setItem("sortOrder", sortOrder);
    }, [sortOrder]);

    // useEffect(() => {
    //     localStorage.setItem("filterTags", filterTags);
    // }, [filterTags]);

    return { posts, setPosts, currentUser, setCurrentUser, userVotes, setUserVotes, subscribedAuthors, setSubscribedAuthors, sortOrder, setSortOrder, filterTags, setFilterTags };
};

export default GlobalEffect;


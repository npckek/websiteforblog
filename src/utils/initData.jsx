import {nanoid} from "nanoid";

export const initializeLocalStorage = () => {

    const post1Id = nanoid(15)
    const post2Id = nanoid(15)
    const user1Id = nanoid(10)
    const user2Id = nanoid(10)

    if (!localStorage.getItem("posts")) {
        const testPosts = [
            {
                author: "Adam",
                authorId: user1Id,
                comments: [],
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut accumsan quam. Morbi in gravida diam, et dignissim nibh. Nunc dignissim, dolor non congue iaculis, diam ex bibendum lacus, eu lobortis augue nulla non mi. Fusce in nibh ex. Nulla id arcu ullamcorper, semper ligula eget, feugiat est. Curabitur ac dui purus. Donec ullamcorper eu nulla in aliquam. Cras tempor arcu elit, sit amet auctor turpis imperdiet nec. Morbi ex tortor, commodo a interdum ac, ultrices ut eros. Suspendisse potenti. Suspendisse diam erat, dignissim eget elit a, luctus convallis ipsum. Proin at dui vitae erat tristique pretium vel ac nulla. Nulla hendrerit tellus id justo ornare dictum. ",
                createdAt: "2025-03-01T09:18:11.134Z",
                dislikes: 0,
                id: post1Id,
                likes: 0,
                tags: [ "Important" , "News" ],
                title: "Lorem",
            },
            {
                author: "Jessica",
                authorId: user2Id,
                comments: [],
                createdAt: "2025-03-01T09:17:11.134Z",
                content: "This is my first Post on this website",
                dislikes: 0,
                id: post2Id,
                likes: 0,
                tags: [ "Meme" , "First" ],
                title: "First Commit",
            }

        ];
        localStorage.setItem("posts", JSON.stringify(testPosts));
    }

    if (!localStorage.getItem("users")) {
        const testUsers = [
            { email: "Adam@google.com",
                id: user1Id,
                name: "Adam",
                password: "password",
                subs: [ ],
            },
            { email: "Jessica@gmail.com",
                id: user2Id,
                name: "Jessica",
                password: "password",
                subs: [ ],
            }
        ];
        localStorage.setItem("users", JSON.stringify(testUsers));
    }

    if (!localStorage.getItem("currentUser")) {
        const testUsers = [
            { email: "Adam@google.com",
                id: user1Id,
                name: "Adam",
                password: "password",
                subs: [ ],
            },
        ];
        localStorage.setItem("currentUser", JSON.stringify(testUsers));
    }


};
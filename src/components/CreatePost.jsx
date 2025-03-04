import React, { useState } from "react";
import {nanoid} from "nanoid";

const CreatePost = ({onPostCreate}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentUser) {
            setError("You must be logged in to create a post.");
            return;
        }

        if (!tags.trim()) {
            setError("Tags cannot be empty.");
            return;
        }

        if (!content.trim()) {
            setError('Пост не может быть пустым!');
            return;
        }

        // Обрабатываем теги, разделяя их пробелом
        const newTags = tags.split(' ').map(tag => tag.trim()).filter(tag => tag.length > 0);

        const newPost = {
            id: nanoid(15),
            title,
            content,
            author: currentUser.name,
            authorId: currentUser.id,
            likes: '',
            dislikes: '',
            comments: [],
            createdAt: new Date().toISOString(),
            tags: newTags, // Сохраняем теги
        };

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));

        onPostCreate(newPost);

        setTitle('');
        setContent('');
        setTags('');
        setError('');
        alert('Пост создан!');
    };

    return (
        <div className="flex w-full flex-col items-center bg-background">
            <form onSubmit={handleSubmit} className="space-y-4 p-4 w-full flex flex-col items-center ">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-block text-text"
                    placeholder='Введите название'
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-block text-text"
                    placeholder="Напишите свой пост..."
                    rows="4"
                    required
                    maxLength="720"
                />
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-block text-text"
                    placeholder="Теги (через пробел)"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Опубликовать
                </button>
            </form>
        </div>
    );
};

export default CreatePost;

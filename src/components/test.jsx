const getStoredData = (key) => {
    const data = localStorage.getItem(key);
    try {
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Ошибка парсинга JSON для ключа "${key}":`, error);
        return null;
    }
};

export default getStoredData;
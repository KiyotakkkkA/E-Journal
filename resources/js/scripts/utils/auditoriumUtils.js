export const AUDITORIUM_TYPES = {
    regular: "Обычная",
    lecture: "Лекционная",
    computer: "Компьютерный класс",
    laboratory: "Лаборатория",
    conference: "Конференц-зал",
};

export const getAuditoriumType = (type) => {
    const types = {
        regular: "Обычная",
        lecture: "Лекционная",
        computer: "Компьютерная",
        laboratory: "Лаборатория",
        conference: "Конференц-зал",
    };

    return types[type] || type;
};

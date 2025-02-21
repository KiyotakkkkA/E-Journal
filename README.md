<div align="center">
  <h1>🎓 E-Journal Platform</h1>
  <p>Веб-платформа для управления учебным процессом</p>
</div>

## 🚀 Технологии

<div align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/Tailwind-000000?style=for-the-badge&logo=tailwind&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router"/>
  <img src="https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white" alt="React Query"/>
  <img src="https://img.shields.io/badge/React%20Hook%20Form-EC4A0A?style=for-the-badge&logo=react%20hook%20form&logoColor=white" alt="React Hook Form"/>
  <img src="https://img.shields.io/badge/React%20Icons-FF4154?style=for-the-badge&logo=react%20icons&logoColor=white" alt="React Icons"/>
  <img src="https://img.shields.io/badge/MobX-FF4154?style=for-the-badge&logo=mobx&logoColor=white" alt="MobX"/>
</div>
    
## 📋 Описание

E-Journal - это современная платформа для организации учебного процесса. Система позволяет эффективно управлять группами студентов, обрабатывать заявки на зачисление и контролировать учебный процесс.

### 🔑 Основной функционал

-   **Управление дисциплинами**

    -   Создание и редактирование дисциплин
    -   Прикрепление преподавателей к дисциплинам

-   **Управление оргструктурой**

    -   Создание и редактирование институтов
    -   Создание и редактирование кафедр
    -   Прикрепление преподавателей к кафедрам

-   **Управление группами**

    -   Создание и редактирование учебных групп
    -   Установка лимита студентов
    -   Просмотр списка студентов группы

-   **Система заявок**

    -   Подача заявок на зачисление в группу
    -   Обработка заявок администратором
    -   Уведомления о статусе заявки

-   **Личный кабинет**
    -   Профиль пользователя
    -   История заявок
    -   Информация о текущей группе
    -   Чат с другими пользователями

### 🛠 Технические особенности

-   **Backend**

    -   Laravel 11
    -   GraphQL API
    -   Sanctum Authentication
    -   MySQL

-   **Frontend**
    -   React 18
    -   React Router
    -   React Query
    -   React Icons
    -   MobX
    -   Bootstrap 5
    -   Tailwind CSS
    -   Vite
    -   Axios

## 🚀 Установка и запуск

1. Клонируйте репозиторий
2. Выполните команду `composer install`
3. Выполните команду `npm install`

4. Настройте .env файл

-   # Для работы основного функционала

    -   В поле `DB_CONNECTION` укажите тип вашей базы данных (данный проект использует MySQL)
    -   В поле `DB_HOST` укажите хост вашей базы данных
    -   В поле `DB_PORT` укажите порт вашей базы данных
    -   В поле `DB_DATABASE` укажите название вашей базы данных
    -   В поле `DB_USERNAME` укажите имя пользователя вашей базы данных
    -   В поле `DB_PASSWORD` укажите пароль вашей базы данных

-   # Для работы сервиса отправки писем

    -   В поле `MAIL_MAILER` укажите сервис отправки писем
    -   В поле `MAIL_HOST` укажите хост вашего почтового сервиса
    -   В поле `MAIL_PORT` укажите порт вашего почтового сервиса
    -   В поле `MAIL_USERNAME` укажите имя пользователя вашего почтового сервиса
    -   В поле `MAIL_PASSWORD` укажите пароль вашего почтового сервиса

5. Выполните команду `php artisan migrate`
6. Выполните команду `php artisan db:seed`
7. Выролните команду `php artisan optimize`
8. Выполните команду `npm run dev`
9. Выполните команду `php artisan serve`

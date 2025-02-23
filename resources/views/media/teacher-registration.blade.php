<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация преподавателя</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-wrapper {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin: 20px 0;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        .content {
            padding: 30px 0;
        }
        .credentials {
            background-color: #f3e8ff;
            border: 2px solid #a855f7;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
        }
        .info-block {
            background-color: #f0fdf4;
            border: 2px solid #22c55e;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <img src="{{ asset('images/logo.png') }}" alt="Логотип" class="logo">
                <h1 style="color: #1f2937; margin: 0;">Добро пожаловать в систему!</h1>
            </div>

            <div class="content">
                <p>Здравствуйте, {{ $name }}!</p>

                <p>Вы были зарегистрированы в системе электронного журнала как преподаватель кафедры <strong>{{ $cafedraName }}</strong>.</p>

                <div class="credentials">
                    <p><strong>Ваши учетные данные:</strong></p>
                    <p>Email: {{ $email }}</p>
                    <p>Пароль: {{ $password }}</p>
                </div>

                <div class="info-block">
                    <p><strong>Информация о вашей учетной записи:</strong></p>
                    <p>Должность: {{ $position }}</p>
                    <p>Ученая степень: {{ $degree }}</p>
                </div>

                <p>Для входа в систему перейдите по ссылке ниже и используйте указанные учетные данные:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{ $loginUrl }}" style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                        Войти в систему
                    </a>
                </div>

                <p style="color: #dc2626; font-weight: 500;">
                    Важно: После первого входа настоятельно рекомендуем сменить пароль в личном кабинете!
                </p>
            </div>

            <div class="footer">
                <p>С уважением,<br>Команда поддержки</p>
                <p>
                    Если у вас возникли вопросы, пожалуйста, свяжитесь с нами:<br>
                    <a href="mailto:support@example.com" style="color: #a855f7;">support@example.com</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>

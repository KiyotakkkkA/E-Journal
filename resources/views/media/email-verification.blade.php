<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение учетной записи</title>
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
        .verification-code {
            background-color: #f3e8ff;
            border: 2px solid #a855f7;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #6b21a8;
            letter-spacing: 5px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #a855f7;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #9333ea;
        }
        .help-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <img src="{{ asset('images/logo.png') }}" alt="Логотип" class="logo">
                <h1 style="color: #1f2937; margin: 0;">Подтверждение учетной записи</h1>
            </div>

            <div class="content">
                <p>Здравствуйте!</p>

                <p>Для завершения регистрации и подтверждения вашей учетной записи, пожалуйста, введите следующий код подтверждения в приложении:</p>

                <div class="verification-code">
                    <div class="code">{{ $verificationCode }}</div>
                </div>

                <p>Или нажмите на кнопку ниже для подтверждения:</p>

                <div style="text-align: center;">
                    <a href="{{ $verificationUrl }}" class="button">
                        Подтвердить учетную запись
                    </a>
                </div>

                <p class="help-text">
                    Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
                    <br>
                    Код подтверждения действителен в течение 60 минут.
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

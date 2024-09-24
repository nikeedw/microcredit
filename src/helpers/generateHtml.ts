export const generateHtml = (amount: string, term: string, monthly: number) => {
    const year = new Date().getFullYear()
    
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Кредит Одобрен</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 2rem 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007cb5;
            font-size: 24px;
            margin-top: 0;
        }
        p {
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
        }
        .highlight {
            font-weight: bold;
            color: #007cb5;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Поздравляем!</h1>
        <p>Вам одобрен кредит на сумму <span class="highlight">$${amount}</span> на срок <span class="highlight">${term}</span>.</p>
        <p>Оплата каждый месяц: <span class="highlight">$${monthly}</span></p>
        <p>Ваш оператор: <span class="highlight">Мельник Данил</span></p>
        <p>Контактный номер: <span class="highlight">+123456780</span></p>
        <p>Если у вас возникли вопросы, свяжитесь с вашим оператором для получения дополнительной информации.</p>
    </div>
    <div class="footer">
        <p>© ${year} MicroCredit. Все права защищены.</p>
    </div>
</body>
</html>
    `
}

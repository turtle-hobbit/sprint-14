# Создание сервера на Node.js с использованием Express.js, REST API, добавлена авторизация
#### Версия: v1.2.0 
---
### Проект размещен на следующих адресах
  + http://turtle-hobbit.students.nomoreparties.space/
  + http://www.turtle-hobbit.students.nomoreparties.space/
  + https://turtle-hobbit.students.nomoreparties.space/
  + https://www.turtle-hobbit.students.nomoreparties.space/

<b>Публичный IP-адрес:</b> 130.193.57.4
---
### Использование проекта с целью разработки
#### Установка
1. Скопируйте репозиторий с проектом на свой компьютер
2. Используя npm, установите зависимости командой:  
```
npm install
```

#### Запуск проекта 
1. Запустите сервер MongoDB командой:
```
mongod
```
1. Воспользуйтесь командами:  
```
npm run dev // запускает сервер на localhost:3000 с хот релоудом
npm run start // запускает сервер на localhost:3000
```
2. Чтобы увидеть результат работы, используйте Postman (или любой другой HTTP-клиент). Приложение обрабатывает следующие запросы:  
  + <b>GET</b>:  
http://localhost:3000/users - <em>возвращает объект со всеми пользователями;</em>  
http://localhost:3000/users/[user_id] - <em>находит пользователя по [user_id];</em>  
http://localhost:3000/cards - <em>возвращает объект со всеми карточками;</em>  
  + <b>POST</b>:  
http://localhost:3000/users (в теле запроса укажите поля name, about и avatar) - <em>создает пользователя;</em>   
http://localhost:3000/cards (в теле запроса укажите поля name и link) - <em>создает карточку;</em>  
  + <b>DELETE</b>:  
http://localhost:3000/cards/[card_id] - <em>удаляет карточку по [card_id];</em>  
  + <b>PATCH</b>:  
http://localhost:3000/users/me (в теле запроса укажите поля name и about) - <em>обновляет информацию о пользователе;</em>  
http://localhost:3000/users/me/avatar (в теле запроса укажите поле avatar) - <em>обновляет аватар пользователя;</em>  

# University Canteen Ordering System

## Project Information
- Course: COMP3810sef 
- Group: Group 26
- Members: [Yan Zihao 13316855],[Yao Jinghong 13415187],[Ling Zhanyi 13252646],[Ling Zhanyi 13252646],[CHAU Chun Hei 13211603], [Yi mingyang 13405145]
- Deployed URL: https://comp3810sef-group26-3.onrender.com/ 

## Features
- Session-based login/logout with user registration (Cookie + express-session + bcryptjs encryption)
- Public menu viewing for all users
- Admin full CRUD operations on dishes via web UI and RESTful APIs
- Three-tier pricing: Student / Staff / Visitor
- 25+ dishes pre-loaded in MongoDB
- Complete RESTful API endpoints (GET/POST/PUT/DELETE)
- MongoDB + Mongoose for data persistence
- EJS templating for dynamic views
- Advanced search with multiple conditions (name, category, price range, spicy) 

## Login/Registration Credentials
- Default Admin: Username `admin` / Password `comp3810` 
- Register new admins at `/register` (passwords encrypted)

## RESTful API Endpoints
| Method | URL               | Description           | Auth Required |
|--------|-------------------|-----------------------|---------------|
| GET    | /api/dishes       | List all dishes       | No            |
| POST   | /api/dishes       | Create new dish       | Yes           |
| PUT    | /api/dishes/:id   | Update dish           | Yes           |
| DELETE | /api/dishes/:id   | Delete dish           | Yes           |

All registered users have administrator privileges.

Public Menu API (no login required): https://comp3810sef-group26-3.onrender.com/api/dishes
After logging in, you can use Edit/Delete on the webpage, or call the POST/PUT/DELETE API via Postman.
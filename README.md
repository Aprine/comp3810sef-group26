# University Canteen Ordering System

## Project Information
- Course: COMP3810sef / COMP3811F
- Group: Group 1 (Update with your group number)
- Members: [Your Name & SID], [Member 2 & SID], ... 
- Deployed URL: https://comp3810sef-group1.onrender.com (Update after deployment)

## Features
- Session-based login/logout with user registration (Cookie + express-session + bcryptjs encryption)
- Public menu viewing for all users
- Admin full CRUD operations on dishes via web UI and RESTful APIs
- Three-tier pricing: Student / Staff / Visitor
- 25+ dishes pre-loaded in MongoDB
- Complete RESTful API endpoints (GET/POST/PUT/DELETE)
- MongoDB + Mongoose for data persistence
- EJS templating for dynamic views
- Advanced search with multiple conditions (name, category, price range, spicy) → Originality bonus achieved

## Login/Registration Credentials
- Default Admin: Username `admin` / Password `comp3810` (legacy support)
- Register new admins at `/register` (passwords encrypted)

## RESTful API Endpoints
| Method | URL               | Description           | Auth Required |
|--------|-------------------|-----------------------|---------------|
| GET    | /api/dishes       | List all dishes       | No            |
| POST   | /api/dishes       | Create new dish       | Yes           |
| PUT    | /api/dishes/:id   | Update dish           | Yes           |
| DELETE | /api/dishes/:id   | Delete dish           | Yes           |

## API Testing Examples (using curl)
```bash
# GET all dishes
curl http://localhost:3000/api/dishes

# POST new dish (after login)
curl -X POST http://localhost:3000/api/dishes \
  -H "Content-Type: application/json" \
  -d '{"name":"New Dish","category":"Main","price":{"student":10,"staff":15,"visitor":20}}'
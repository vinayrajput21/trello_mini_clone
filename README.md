# Trello Mini Clone

A full-stack Trello-style task management built using **React + Node.js + MongoDB**.  
Users can create boards, lists, and cards with drag-and-drop functionality.  
This project features full authentication (JWT), dynamic UI, and CI/CD deployment.
The Frontend hosted on Netlify and the Backend hosted on Render.

---

##  Tech Stack

### **Frontend**
- React.js  
- Vite  
- Axios  
- React Beautiful DnD  
- TailwindCSS  

### **Backend**
- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JWT Authentication  
- CORS enabled  

### **CI/CD & Deployment**
- **Netlify** → Frontend  
- **Render** → Backend  
- **GitHub Actions** → Auto deploy on every push to `main`

---

##  How to Run Locally

### for Backend
cd Backend
npm install
# for dev with nodemon (if configured)
npm run dev
# or
npm start


### for Frontend
cd Frontend
npm install
npm run dev 


##  Folder Structure

Trello-mini/
├── Backend/
│   ├── Controller/
│   │   ├── Auth.controller.js
│   │   └── Board.controller.js
│   ├── Middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Board.model.js
│   │   ├── Card.model.js
│   │   └── User.model.js
│   ├── Routes/
│   │   ├── auth.route.js
│   │   └── board.route.js
│   ├── SmartRecommendation/
│   │   └── Recommendation.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Board.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── InviteBox.jsx
│   │   │   ├── List.jsx
│   │   │   └── RecommendationPanel.jsx
│   │   ├── Pages/
│   │   │   ├── BoardView.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── .github/
    └── workflows/
        └── deploy.yml



## Database Schema (MongoDB + Mongoose)

# User Schema

| Field        | Type   | Description            |
| ------------ | ------ | ---------------------- |
| name         | String | Name of the user       |
| email        | String | Unique email for login |
| passwordHash | String | Encrypted password     |
| createdAt    | Date   | Auto-added timestamp   |


# Card Schema

| Field     | Type   | Description                 |
| --------- | ------ | --------------------------- |
| title     | String | Card/task title             |
| dueDate   | Date   | Optional due date           |
| createdAt | Date   | Auto timestamp              |
| updatedAt | Date   | Auto timestamp when updated |


# List Schema

| Field     | Type   | Description           |
| --------- | ------ | --------------------- |
| title     | String | List name             |
| cards     | Array  | Array of card objects |
| createdAt | Date   | Auto timestamp        |

# Board Schema

| Field         | Type            | Description                 |
| ------------- | --------------- | --------------------------- |
| name          | String          | Board title                 |
| owner         | ObjectId        | User who owns the board     |
| collaborators | Array<ObjectId> | Users with access           |
| lists         | Array           | Contains all lists in board |
| createdAt     | Date            | Auto timestamp              |

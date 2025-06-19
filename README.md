# TLE Assignment

## 🧩 Product Overview

TLE Assignment is a web application designed to help students track their coding contest participation and performance. It provides features for:

* Managing student profiles
* Viewing contest histories and problem data
* Sending weekly practice reminders
* Exporting student data as CSV for reporting

## 🎬 Demo Video

* [Watch Demo Video](https://drive.google.com/file/d/1SuUqtmekHsKO0ifO0yf8jWum8NfPYYZu/view?usp=sharing)

## 📁 Repository

* GitHub: [https://github.com/shivam969619/tle-assignment](https://github.com/shivam969619/tle-assignment)

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose)
* **Other:** CSV export, JWT-based auth (optional for protected routes)

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/tke-assignment.git
   ```
2. **Backend**

   ```bash
   cd tke-assignment/backend
   npm install
   npm run dev
   ```
3. **Frontend**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. Open your browser at `http://localhost:8080` to view the app.

---

## 📡 API Endpoints

### Student Routes (`/api/students`)

| Method | Endpoint            | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/`                 | List all students                    |
| POST   | `/`                 | Add a new student                    |
| GET    | `/export`           | Export all students as CSV           |
| GET    | `/:id`              | Get student by ID                    |
| PUT    | `/:id`              | Update student by ID                 |
| DELETE | `/:id`              | Delete student by ID                 |
| GET    | `/:id/contests`     | Get contest history for a student    |
| GET    | `/:id/problem-data` | Get problem data for a student       |
| GET    | `/:id/last-updated` | Get last sync time for a student     |
| PUT    | `/:id/reminder`     | Toggle weekly reminder for a student |

### Reminder Routes (`/api/reminders`)

| Method | Endpoint | Description                      |
| ------ | -------- | -------------------------------- |
| POST   | `/send`  | Trigger sending weekly reminders |

> **Note:** Protect reminder routes in production with API keys or JWT authentication.

---

## 🖥️ Interfaces

* **Student Dashboard:** View and search student profiles, contest history charts, and problem details.
* **Admin Panel:** Manage students, export data, and configure reminder settings.
* **Reminder Service:** Automated weekly email/SMS reminders to students for practicing coding problems.

---

## 📬 Contact

For questions or support, reach out to **Shivam Dubey** at `shivam7214376@gmail.com`.

# 🎉 Event Enrollment System (User-Centric)

## 📌 Introduction

The **Event Enrollment System** is a user-focused platform designed to allow
individuals to register, manage profiles, explore events, and enroll in them
seamlessly. The system ensures structured data management through a relational
database architecture that supports user accounts, event creation, and
enrollment tracking.

This project revolves around **user functionality** — from account creation to
event participation — providing a complete user journey within the platform.

---

## 📖 Table of Contents

- [Introduction](#-introduction)
- [Database Architecture Overview](#-database-architecture-overview)
- [User Functionality](#-user-functionality)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Dependencies](#-dependencies)
- [API & Data Flow](#-api--data-flow)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🗄 Database Architecture Overview

The system is built on three core relational tables:

### 1️⃣ `user` Table

Stores user account information.

| Field           | Type      | Description                |
| --------------- | --------- | -------------------------- |
| user_id (PK)    | number    | Unique identifier for user |
| username        | text      | Unique username            |
| email           | email     | User email address         |
| password        | hash_text | Hashed password            |
| location        | text      | User location              |
| dob             | date      | Date of birth              |
| phone           | text      | Contact number             |
| is_premium_user | boolean   | Premium membership status  |
| created_at      | date      | Account creation date      |

---

### 2️⃣ `event` Table

Stores event details created by users.

| Field         | Type   | Description                                 |
| ------------- | ------ | ------------------------------------------- |
| event_id (PK) | number | Unique event identifier                     |
| user_id (FK)  | number | Creator (User)                              |
| event_title   | text   | Event name                                  |
| type          | text   | Event category                              |
| description   | text   | Event details                               |
| location      | text   | Event location                              |
| capacity      | number | Max participants                            |
| entry_fee     | number | Participation fee                           |
| event_date    | date   | Scheduled date                              |
| status        | text   | Event status (upcoming/completed/cancelled) |
| updated_at    | date   | Last update timestamp                       |
| created_at    | Type   | Event creation timestamp                    |

---

### 3️⃣ `enrollment` Table

Manages user registrations for events.

| Field              | Type   | Description                                     |
| ------------------ | ------ | ----------------------------------------------- |
| enrollment_id (PK) | number | Unique enrollment ID                            |
| event_id (FK)      | number | Related event                                   |
| user_id (FK)       | number | Enrolled user                                   |
| status             | text   | Enrollment status (confirmed/pending/cancelled) |
| enrolled_at        | date   | Enrollment date                                 |

---

## 👤 User Functionality

The entire system is built around the user's interaction with the platform.

### 🔐 1. User Registration & Authentication

- Create account
- Secure password storage (hashed)
- Login using email/username
- Premium membership toggle
- Profile management

---

### 📝 2. Profile Management

Users can:

- Update personal information
- Change location
- Upgrade to premium
- View account creation date
- Manage contact details

---

### 🎟 3. Event Discovery

Users can:

- Browse available events
- Filter by type or location
- View event details
- Check capacity & entry fees
- See event status

---

### 🏗 4. Event Creation (User as Organizer)

A registered user can:

- Create events
- Set capacity limits
- Define entry fees
- Update event details
- Cancel events
- Track participants

---

### 📌 5. Event Enrollment

Users can:

- Enroll in events
- View enrollment status
- Cancel enrollment
- Track enrollment history

The system ensures:

- Foreign key integrity
- Capacity-based enrollment control
- Status tracking for each enrollment

---

### 👑 6. Premium User Benefits (Optional Feature)

Premium users may:

- Access exclusive events
- Receive discounts
- Priority enrollment
- Special badge/recognition

---

## ✨ Features

- Secure user authentication
- Event lifecycle management
- Enrollment tracking
- Capacity validation
- Relational integrity
- Status management
- Premium user support

---

## ⚙ Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/event-enrollment-system.git
```

2. Navigate to the project directory:

```bash
cd event-enrollment-system
```

3. Set up the database using your preferred SQL engine.

4. Run migrations or execute schema SQL file.

# 🚀 Usage

**User Flow**:

1. User registers.

2. User logs in.

3. User browses events.

4. User enrolls in event.

5. User tracks enrollment status.

6. User optionally creates events.

# 📦 Dependencies

1. Relational Database ( SQLite )

2. Backend Framework ( Deno )

3. Password Hashing

4. Authentication Middleware

# 🔄 API & Data Flow (Conceptual)

1. User → Event Relationship

2. One user can create multiple events.

3. User → Enrollment Relationship

4. One user can enroll in multiple events.

5. Event → Enrollment Relationship

6. One event can have multiple users enrolled.

# 👥 Contributors

Project Owner: Karthik

Project Owner: Khasim

# 📜 License

This project is licensed under the MIT License.
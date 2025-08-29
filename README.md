# 💳 Payment App – Technical Challenge

This project is a **simple payment system** built for technical evaluation purposes.  
It demonstrates **user registration & login**, **role-based access**, and **transaction authorization rules** with a clean, modern frontend (Next.js 15) and Firebase backend.

---

## 🚀 Features

-   **User Registration & Login**
    -   Users can sign up with name, email, and password.
    -   Auth handled by **Firebase Authentication**.
-   **Transactions**
    -   Create a financial transaction with amount, card number, holder name, expiry, and CVV.
    -   The backend applies rules:
        -   Amount ≤ R$ 1.000,00 → **APPROVED** ✅
        -   Amount > R$ 1.000,00 → **DECLINED** ❌
    -   Stores only safe card info (last4, brand, expiry). **PAN and CVV are never persisted.**
-   **Role-based Access**
    -   Normal users see **only their own** transactions.
    -   Admins see **all transactions** in the system.
-   **Secure Backend**
    -   Built with Next.js API routes + Firebase Admin SDK.
    -   Firebase ID tokens (JWT) verified on every API call.
-   **Responsive UI**
    -   Forms and tables styled with Tailwind CSS.
-   **Dockerized**
    -   Runs locally with Docker + Docker Compose.

---

## 🛠️ Tech Stack

-   **Frontend/Backend:** Next.js 15 (App Router)
-   **Auth & DB:** Firebase (Authentication, Firestore)
-   **Admin SDK:** Firebase Service Account (ADC)
-   **Styling:** Tailwind CSS
-   **Forms & Validation:** React Hook Form + Zod
-   **Containerization:** Docker, Docker Compose

---

## 🖥️ How to run this project

### ⚙️ Requirements

-   [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

-   Firebase configuration files and credentials (not included in this repository for security reasons).

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/marcotulioteles/frontend-challenge-cali.git
```

```bash
cd frontend-challenge-cali
```

2. **Obtain Firebase credentials**

Some files are not included in the repository for security reasons. Please contact Marco Reis (📧 marcotuliod3v@gmail.com) to request the Firebase configuration and service account keys required to run the project locally.

3. **Create the secrets folder**

-   At the project root, create a folder called `secrets/`.

-   Inside it, create a file named `firebase-admin.json`.

-   Paste the JSON service account key provided by the developer into this file.

4. **Configure environment variables**

-   Copy the contents provided by the developer into the `.env.example` file at the root of the project, then rename the file to `env.local`.

5. **Run the project with Docker**

```bash
docker compose up --build
```

6. **Access the application**

Once the containers are up, the app will be available at:
`http://localhost:3000`

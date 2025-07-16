# BMS - Users and Documents Management

UDM (Users & Documents Management) is a monolithic-based application built using NestJS. It provides authentication, users & docuemnts management functionalities.

## Project Architecture

The application consists of the following services:

#### Auth Endpoints:
- `POST /auth/signup` - User signup
- `POST /auth/signin` - User login


#### Users Endpoints:
- `POST /users` - User add
- `GET /users/:id` - User show by ID
- `GET /users` - User list
- `PATCH /users` - User update(loggged in user)
- `DELETE /users/:id` - User delete


## Installation & Setup

### Steps to Run Locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/vraj-verma/jk-repo.git
   cd jk-repo
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start Server:
   ```sh
   npm run start:dev
   ```

4. Access API Server at: `http://localhost:7001/api/v1`



# eNursery Project

## Overview

**eNursery** is a platform designed to assist parents in improving their child's cognitive and motor skills through regular assessments and tailored programs. The platform allows parents to track their child's development and receive personalized tasks every three months based on assessment results.
 
## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Running Development Environment with Docker Compose](#running-development-environment-with-docker-compose)
   - [API Documentation](#api-documentation)
5. [Usage](#usage)
6. [Testing](#testing)

## Features

- Admin and User Management (CRUD)
- Child Assessment and Task Generation based on Assessment Results
- Regular Program Assignments and Email Notifications
- User Account Activation and Management
- Password Management Features (Reset, Change)
- Security Features (JWT Authentication, Authorization)

## Technologies Used

- **Backend**: NestJS
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Authentication**: JWT
- **State Management**: Mongoose
- **Other Tools**: MailGun for email notifications

## Getting Started

### Prerequisites

- Ensure you have Docker and Docker Compose installed on your machine.
- You need to have Node.js and npm installed on your machine.

### Running Development Environment with Docker Compose

1. **Clone the Repository**

   ```bash
   git clone https://github.com/amgadfikry/elnursery.git
   cd eNursery
   ```
   
2. **Install node dependencies**

   ```bash
   npm i
   ```

3. **Create a `.env` file in the root directory**

   ```bash
    touch .env
    ```

4. **Add the following environment variables to the `.env` file**

   ```bash
      DATABASE_HOST=mongodb-primary:27017,mongodb-secondary1:27017,mongodb-secondary2:27017
      ADMIN_NAME=[your name]
      ADMIN_EMAIL=[your email]
      JWT_SECRET=66fafa7278f00e4bd784d57e
      CORS_ORIGIN=http://localhost:3000
      MAILGUN_API_KEY=[your key]
      MAILGUN_DOMAIN=[your domain]
    ```

5. **Run the following command to start the development environment**

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up server
   ```

6. **Access the API Documentation**

   - Open your browser and navigate to `http://localhost:3000/api`

### API Documentation

- The API documentation is generated using Swagger. You can access the documentation by navigating to `http://localhost:3000/api` after starting the development environment.
- The API documentation provides information about the available endpoints, request and response schemas, and authentication requirements.
- You can test the endpoints directly from the documentation by clicking on the `Try it out` button.
- The documentation also provides information about the required headers and parameters for each endpoint.
- You can also test the endpoints using tools like Postman or Insomnia.
- The API documentation is automatically updated based on the code changes.
- The API documentation is accessible to both developers and non-developers.
- The API documentation provides examples of request and response payloads.

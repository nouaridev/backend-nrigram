Nrigram Chat Application
Project Overview

Nrigram is a real-time chat backend built with Node.js, Express, and MongoDB. It supports user authentication, 1-to-1 conversations, and message management.

Key Features:

User signup/signin with profile picture upload (Cloudinary + Multer)

JWT-based authentication

Create and manage conversations between users

Send and retrieve messages

Populate participants and message sender information for frontend display

Tech Stack:

Backend: Node.js, Express

Database: MongoDB (Mongoose)

Authentication: JWT

File Upload: Multer + Cloudinary

Setup Instructions

Clone the repository

git clone <repo-url>
cd nrigram


Install dependencies

npm install


Create a .env file with:

MONGO_URI=<your-mongo-db-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>


Run the application

npm run dev


Base URL

http://localhost:5000/api

API Documentation
1. User Authentication
Signup

URL: /api/user/signup

Method: POST

Headers: Content-Type: multipart/form-data

Body:

Field	Type	Description
name	String	User's full name
email	String	User's email
password	String	Password
file	File	Profile picture

Response:

{
  "success": true,
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "pfpUrl": "https://..."
  }
}

Signin

URL: /api/user/signin

Method: POST

Headers: Content-Type: application/json

Body:

{
  "email": "john@example.com",
  "password": "password123"
}


Response:

{
  "success": true,
  "token": "<JWT Token>",
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "pfpUrl": "https://..."
  }
}

2. Conversations
Get all conversations of a user

URL: /api/main/conversations

Method: GET

Headers: Authorization: Bearer <JWT>

Response:

{
  "success": true,
  "conversations": [
    {
      "_id": "convId",
      "participants": [
        { "_id": "u1", "name": "Alice", "pfpUrl": "..." },
        { "_id": "u2", "name": "Bob", "pfpUrl": "..." }
      ],
      "lastMessage": {
        "_id": "msgId",
        "content": "Hello!",
        "sender": { "_id": "u1", "name": "Alice" },
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
  ]
}

3. Messages
Send message to existing conversation

URL: /api/main/messages/:conversationId

Method: POST

Headers: Authorization: Bearer <JWT>

Body:

{
  "content": "Hello!",
  "type": "text"
}


Response: Returns the saved message populated with sender info.

Send first-time message (create conversation if needed)

URL: /api/main/messages

Method: POST

Headers: Authorization: Bearer <JWT>

Body:

{
  "recipientId": "userId",
  "content": "Hello for the first time!",
  "type": "text"
}


Response: Returns the saved message with conversation created automatically.

Get all messages of a conversation

URL: /api/main/messages/:conversationId

Method: GET

Headers: Authorization: Bearer <JWT>

Response:

{
  "success": true,
  "messages": [
    {
      "_id": "msgId",
      "conversation": {
        "_id": "convId",
        "participants": [
          { "_id": "u1", "name": "Alice", "pfpUrl": "..." },
          { "_id": "u2", "name": "Bob", "pfpUrl": "..." }
        ]
      },
      "sender": { "_id": "u1", "name": "Alice", "pfpUrl": "..." },
      "content": "Hello!",
      "type": "text",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}

Notes

All routes requiring authentication need the JWT token in Authorization header.

populate() is used for participants and sender fields so frontend can directly display names and profile pictures.

Timestamps (createdAt and updatedAt) are automatically returned.
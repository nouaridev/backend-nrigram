# Nrigram Chat Application

A real-time chat backend built with Node.js, Express, and MongoDB that supports user authentication, 1-to-1 conversations, and message management.

## 🚀 Key Features

- **User Authentication**: Signup/signin with profile picture upload
- **File Upload**: Cloudinary integration with Multer for profile pictures
- **JWT-based Authentication**: Secure token-based authentication
- **Conversation Management**: Create and manage 1-to-1 conversations
- **Message System**: Send and retrieve messages with full participant info
- **Populated Responses**: All responses include populated participant and sender information for easy frontend integration

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer + Cloudinary
- **Environment**: Node.js runtime

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Cloudinary account for image uploads

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd nrigram
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=<your-mongo-db-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

### 4. Run the Application

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 User Authentication

### Signup

Create a new user account with profile picture.

- **URL**: `/api/user/signup`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:

| Field    | Type   | Description         |
|----------|--------|---------------------|
| name     | String | User's full name    |
| email    | String | User's email        |
| password | String | Password            |
| file     | File   | Profile picture     |

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "pfpUrl": "https://..."
  }
}
```

### Signin

Authenticate existing user.

- **URL**: `/api/user/signin`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
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
```

---

## 💬 Conversations

### Get All Conversations

Retrieve all conversations for the authenticated user.

- **URL**: `/api/main/conversations`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <JWT>`

**Response**:
```json
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
```

---

## 📝 Messages

### Send Message to Existing Conversation

Send a message to an existing conversation.

- **URL**: `/api/main/messages/:conversationId`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <JWT>`
- **Body**:

```json
{
  "content": "Hello!",
  "type": "text"
}
```

**Response**: Returns the saved message populated with sender information.

### Send First-Time Message

Create a new conversation and send the first message.

- **URL**: `/api/main/messages`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <JWT>`
- **Body**:

```json
{
  "recipientId": "userId",
  "content": "Hello for the first time!",
  "type": "text"
}
```

**Response**: Returns the saved message with conversation created automatically.

### Get All Messages

Retrieve all messages from a specific conversation.

- **URL**: `/api/main/messages/:conversationId`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <JWT>`

**Response**:
```json
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
```

## 📌 Important Notes

- All routes requiring authentication need the JWT token in the `Authorization` header
- The API uses `populate()` for participants and sender fields, so the frontend can directly display names and profile pictures
- Timestamps (`createdAt` and `updatedAt`) are automatically included in responses
- Profile pictures are stored on Cloudinary and URLs are returned in responses
- Conversations are automatically created when sending a first-time message to a recipient

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
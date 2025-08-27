# 🏠 Real Estate Platform

A comprehensive full-stack real estate platform built with modern web technologies. This application allows users to browse, search, and manage real estate listings with features like real-time messaging, user authentication, and interactive maps.

## 📜 Table of Contents

- [✨ Features](#-features)
- [🖼️ Screenshots](#-screenshots)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📊 Database Schema](#-database-schema)
- [🔧 API Endpoints](#-api-endpoints)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👨‍💻 Author](#-author)

## ✨ Features

This platform is packed with features to provide a seamless experience for both property seekers and sellers.

### 🏘️ Property Management

-   **Property Listings**: Browse a wide variety of properties, including apartments, houses, condos, and land.
-   **Advanced Search & Filtering**: Easily find properties with a powerful search engine that filters by location, price, property type, number of bedrooms, and other amenities.
-   **Interactive Maps**: Visualize property locations on an interactive map powered by Leaflet, making it easy to understand the neighborhood and surrounding areas.
-   **Detailed Property Information**: Get all the details you need, including property descriptions, utilities, pet policies, nearby schools, bus stops, and restaurants.
-   **Save Properties**: Bookmark your favorite properties to easily access them later.

### 👤 User-Specific Features

-   **Secure User Authentication**: A robust registration and login system using JWT and bcrypt ensures user data is safe.
-   **Personalized User Profiles**: Users can manage their profile information and upload a custom avatar.
-   **Post and Manage Listings**: Authenticated users can create, update, and delete their own property listings.
-   **Saved Properties Dashboard**: A dedicated section in the user profile to view and manage saved properties.

### 💬 Real-time Communication

-   **Instant Messaging**: A real-time chat system, built with Socket.io, allows for instant communication between potential buyers and sellers.
-   **Online User Status**: See which users are currently online.
-   **Message Notifications**: Receive real-time notifications for new messages.
-   **Persistent Chat History**: All conversations are saved and can be reviewed at any time.

### 🎨 Modern and Responsive User Interface

-   **Responsive Design**: The application is fully responsive and works seamlessly on desktops, tablets, and mobile devices.
-   **Modern UI/UX**: A clean, intuitive, and modern user interface designed with SCSS for a great user experience.
-   **Interactive Components**: The UI is full of interactive elements like image sliders, dynamic search bars, and filters to make the user journey as smooth as possible.
-   **Rich Text Editor**: Use a rich text editor (React Quill) for detailed property descriptions.
-   **Image Management**: Easily upload multiple images for a property listing using Cloudinary's powerful image management service.

## 🖼️ Screenshots

*(Add some screenshots of your application here to give users a visual overview of the project.)*

## 🛠️ Tech Stack

This project is built with a modern, full-stack technology set.

### Frontend

-   **React 18**: A powerful JavaScript library for building user interfaces.
-   **Vite**: A next-generation frontend tooling that provides a faster and leaner development experience.
-   **React Router DOM**: For handling client-side routing.
-   **SCSS**: For advanced and maintainable CSS styling.
-   **Leaflet**: An open-source JavaScript library for interactive maps.
-   **React Quill**: A rich text editor for creating detailed property descriptions.
-   **Axios**: A promise-based HTTP client for making requests to the backend API.
-   **Zustand**: A small, fast, and scalable state-management solution.
-   **Socket.io Client**: For real-time, bidirectional event-based communication.

### Backend

-   **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
-   **Express.js**: A minimal and flexible Node.js web application framework.
-   **Prisma**: A next-generation ORM for Node.js and TypeScript.
-   **MongoDB**: A NoSQL database for storing application data.
-   **JWT (JSON Web Tokens)**: For secure user authentication.
-   **bcrypt**: A library for hashing passwords.
-   **Socket.io**: For enabling real-time, bidirectional and event-based communication.

### Additional Tools

-   **Cloudinary**: For cloud-based image and video management.
-   **Cookie Parser**: For handling cookies in Express.js.
-   **CORS**: For enabling Cross-Origin Resource Sharing.

## 📁 Project Structure

```
Real_State_Project/
├── api/                    # Backend API server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── prisma/            # Database schema
│   └── app.js             # Main server file
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── routes/        # Page components
│   │   ├── context/       # React context providers
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
└── socket/                # Socket.io server
    └── app.js             # Real-time messaging server
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB database (local or cloud-hosted)
-   A Cloudinary account for image uploads

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/sanskar-502/Real_State_Project.git
    cd Real_State_Project
    ```

2.  **Install dependencies for all services**

    ```bash
    # Install API dependencies
    cd api
    npm install

    # Install client dependencies
    cd ../client
    npm install

    # Install socket dependencies
    cd ../socket
    npm install
    ```

3.  **Set up environment variables**

    Create a `.env` file in the `api` directory and add the following variables:

    ```env
    DATABASE_URL="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
    CLIENT_URL="http://localhost:5173"
    ```

4.  **Set up the database**

    ```bash
    cd api
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the development servers**

    You will need to open three separate terminal windows to run the API, client, and socket servers.

    ```bash
    # In terminal 1: Start the API server (runs on port 8800)
    cd api
    npm start

    # In terminal 2: Start the client development server (runs on port 5173)
    cd client
    npm run dev

    # In terminal 3: Start the socket server (runs on port 4000)
    cd socket
    node app.js
    ```

6.  **Access the application**

    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **API**: [http://localhost:8800](http://localhost:8800)
    -   **Socket**: [http://localhost:4000](http://localhost:4000)

## 📊 Database Schema

The application uses MongoDB with Prisma as the ORM. The main entities are:

-   **User**: Stores user information, including credentials and profile data.
-   **Post**: Represents a property listing with all its details.
-   **PostDetail**: Contains extended information about a property.
-   **SavedPost**: A join table to keep track of properties saved by users.
-   **Chat**: Represents a conversation between two users.
-   **Message**: Stores individual chat messages within a conversation.

## 🔧 API Endpoints

Here is a list of the main API endpoints available.

### Authentication

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in an existing user.
-   `POST /api/auth/logout`: Log out the current user.

### Users

-   `GET /api/users/:id`: Get a user's profile information.
-   `PUT /api/users/:id`: Update a user's profile.
-   `DELETE /api/users/:id`: Delete a user's account.

### Posts

-   `GET /api/posts`: Get all posts, with support for filtering.
-   `POST /api/posts`: Create a new post.
-   `GET /api/posts/:id`: Get a single post by its ID.
-   `PUT /api/posts/:id`: Update an existing post.
-   `DELETE /api/posts/:id`: Delete a post.

### Chats & Messages

-   `GET /api/chats`: Get all chats for the current user.
-   `POST /api/chats`: Create a new chat with another user.
-   `GET /api/messages/:chatId`: Get all messages for a specific chat.
-   `POST /api/messages`: Send a new message in a chat.

## 🚀 Deployment

### Frontend Deployment

To build the frontend for production, run the following command:

```bash
cd client
npm run build
```

This will create a `dist` folder with the optimized static assets that can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Backend Deployment

-   Deploy the API server (the `api` directory) to your preferred hosting platform, such as Heroku, Render, or a VPS.
-   Make sure to set up the environment variables on your hosting platform.
-   Configure the CORS settings in `api/app.js` to allow requests from your production frontend URL.

### Database

-   It is recommended to use a cloud-hosted MongoDB solution like MongoDB Atlas for production.
-   Update the `DATABASE_URL` in your production environment variables to point to your cloud database.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the `LICENSE` file for more details.

## 👨‍💻 Author

**Real Estate Platform** - A modern full-stack real estate application.
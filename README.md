<div align="center">

# 🌟 Aesthetic Portfolio

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-065F46?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Contentful](https://img.shields.io/badge/Contentful-333333?style=for-the-badge&logo=contentful&logoColor=white)](https://www.contentful.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> *A Personal Portfolio and Blog with Modern Design and Dynamic Content*

[🎯 Overview](#-overview) •
[✨ Features](#-features) •
[💻 Tech Stack](#-tech-stack) •
[📦 Installation](#-installation) •
[📄 Documentation](#-documentation) •
[👨‍💻 Author](#-author)

</div>

## 🎯 Overview

This project is a personal portfolio website designed with a modern and aesthetic feel. It's built using React and TypeScript, leveraging Tailwind CSS for styling and Framer Motion for animations. A key feature is the integrated blog section, dynamically powered by Contentful for content management and Firebase for interactive elements like views, likes, bookmarks, and comments.

It serves as a platform to showcase work, share thoughts, and demonstrate development skills with a focus on a polished user experience and technical integration.

## ✨ Features

*   **Dynamic Blog (Thoughts Section)**
    *   Displays blog posts fetched from Contentful.
    *   Renders rich text content from Contentful, including formatted text and code blocks with syntax highlighting.
    *   Uses slug-based routing for clean, SEO-friendly URLs for individual posts.
*   **Blog Post Interactivity (Firebase Integration)**
    *   Tracks and displays view counts for each post.
    *   Allows authenticated users to like and bookmark posts.
    *   Includes a full commenting system with user authentication.
*   **Blog Filtering and Sorting**
    *   Comprehensive search functionality.
    *   Filter posts by selected tags and display favorited posts.
    *   Sort posts by publication date, comment count, view count, and number of favorites.
    *   Features stylish filter controls and statistics display with informative tooltips.
*   **Responsive Navigation**
    *   A sticky Navbar that adapts to scrolling.
    *   Highlights the active section based on the current scroll position on the main page and the route on the thoughts/blog pages.
*   **User Authentication**
    *   Integrates Firebase Authentication for secure user sign-in.
    *   Required for commenting, liking, and bookmarking blog posts.
*   **Modern User Interface**
    *   Developed with Tailwind CSS for a utility-first approach to styling.
    *   Incorporates subtle gradients, shadows, and rounded elements for an aesthetic look.
*   **Animations**
    *   Utilizes Framer Motion for smooth page transitions, element reveals, and interactive components.
*   **Notifications**
    *   Provides user feedback through non-blocking toast notifications using react-hot-toast.

## 💻 Tech Stack

### Core Technologies

*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **Content Management**: Contentful
*   **Backend/Database**: Firebase (Firestore, Authentication)
*   **Routing**: React Router DOM

### Libraries & Tools

*   **Animations**: Framer Motion
*   **UI Notifications**: React Hot Toast
*   **Code Highlighting**: React Syntax Highlighter
*   **Date Formatting**: Date-fns
*   **Contentful Rich Text**: @contentful/rich-text-react-renderer, @contentful/rich-text-types
*   **Icons**: Heroicons

## 📦 Installation

### Prerequisites

*   Node.js (v18 or higher recommended)
*   pnpm (or npm/yarn)

### 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    *(Or use npm/yarn: `npm install` or `yarn install`)*

3.  **Set up Environment Variables:**
    *   Create a `.env` file in the root directory.
    *   Copy the contents of `.env.example` into `.env`.
    *   Replace the placeholder values with your actual API keys and configuration details from Contentful and Firebase.
    ```properties
    # Contentful API Credentials
    VITE_CONTENTFUL_SPACE_ID=your_contentful_space_id
    VITE_CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

    # Firebase Configuration (replace with your project's config)
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id # Optional
    ```

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    *(Or `npm run dev` or `yarn dev`)*

    The application should open in your browser at `http://localhost:5173` (or the port indicated in your terminal).

## 📄 Documentation

### Contentful Setup

*   Ensure you have a Contentful space configured.
*   Set up a Content Model that includes fields for blog posts (e.g., Title, Slug, Published Date, Author, Cover Image, Tags, Content - using the Rich Text editor).
*   Populate your Contentful space with blog post entries.
*   Update `.env` with your Contentful Space ID and Delivery API Access Token.

### Firebase Setup

*   Set up a Firebase project.
*   Enable **Authentication** (e.g., Email/Password, Google Sign-In) and **Firestore Database**.
*   Update `.env` with your Firebase configuration details.
*   Configure Firestore Security Rules to manage read/write access for posts, comments, views, likes, and bookmarks based on user authentication.

## 👨‍💻 Author

<div align="center">
  <!-- Replace with your actual profile picture link -->
  <!-- <img src="link_to_your_profile_picture.jpg" style="width:100px; height:100px;border-radius:50%; " alt="Author Avatar"> -->

### Suman Bisunkhe
Java Developer | Frontend Enthusiast

[![GitHub](https://img.shields.io/badge/GitHub-sumanbisunkhe-black?style=for-the-badge&logo=github)](https://github.com/sumanbisunkhe)
[![Email](https://img.shields.io/badge/Email-sumanbisunkhe304%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:sumanbisunkhe304@gmail.com)

</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ using React, Contentful, and Firebase.

</div>

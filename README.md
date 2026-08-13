# Imagine.bo - Full Stack Application

Welcome to the **Imagine.bo** frontend repository! This project is a modern, responsive, and aesthetically rich web application built to deliver a seamless farm-to-table restaurant and events experience. It serves as the client-side of the broader Imagine.bo full-stack ecosystem.

## 🌟 Overview

Imagine.bo provides an elegant interface for users to:
- View seasonal menus and farm stories.
- Book reservations seamlessly.
- Explore upcoming events and farm experiences.
- Browse rich image galleries of farm-to-table offerings.

## Features

- **Modern UI/UX:** Smooth animations and parallax botanical backgrounds using Framer Motion.
- **Responsive Design:** Fully mobile-responsive interface utilizing Tailwind CSS.
- **Dynamic Content:** Showcasing seasonal dishes, upcoming events, and farm details.
- **Reservation System:** Integrated frontend forms with built-in validation for easy table booking.
- **Performance Optimized:** Fast builds and hot-module replacement powered by Vite.

## Tech Stack

**Frontend Framework & Tooling:**
- [React 19](https://react.dev/) - UI Library
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS Framework
- [React Router](https://reactrouter.com/) - Client-side Routing

**UI Components & Animations:**
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/) - Iconography

**Utilities & Testing:**
- [Axios](https://axios-http.com/) - HTTP Client
- [Date-fns](https://date-fns.org/) - Date Formatting
- [ESLint](https://eslint.org/) - Code Linting

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

1. Clone the repository and navigate into the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs ESLint to identify code issues.
- `npm run lint:fix`: Automatically fixes linting issues (including unused imports/variables).
- `npm run check-logic`: Runs TypeScript compiler logic checks.

## 📁 Project Structure

```text
frontend/
├── public/               # Static assets (SVGs, favicon)
├── src/                  # Application source code
│   ├── components/       # Reusable React components (Header, HeroSection, etc.)
│   ├── config/           # API configurations
│   ├── pages/            # Page-level components (LandingPage, etc.)
│   ├── App.jsx           # Root application component
│   ├── index.css         # Global Tailwind CSS styles
│   └── main.jsx          # Application entry point
├── eslint.config.js      # ESLint configuration
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Powered by Imagine.bo*

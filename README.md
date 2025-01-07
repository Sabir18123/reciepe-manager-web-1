
# Recipe Manager App

## Overview
The Recipe Manager App is a web application that allows users to create, edit, delete, and organize recipes. It features filtering, sorting, and drag-and-drop functionality.

## Prerequisites
- Node.js installed
- JSON Server installed globally

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sabir18123/reciepe-manager-web-1
   cd recipe-manager-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Database**:
   - Install JSON Server globally if not already installed:
     ```bash
     npm i -g json-server
     ```
   - Run the JSON Server:
     ```bash
     json-server --watch json/db.json -p 3001
     ```

4. **Start the Application**:
   ```bash
   npm start
   ```
   - The app will be available at: [http://localhost:3000](http://localhost:3000)

## File Structure
- **src/**: Contains all source code.
- **json/**: Contains the database file `db.json`.

## Technologies Used
- React
- JSON Server
- Tailwind CSS
- React Router

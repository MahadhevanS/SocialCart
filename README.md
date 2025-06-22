# SocialCart
  An e-commerce website that promotes smart, sustainable and eco-friendly products with advanced user experiences enabled through social networking.

## Features
- Connect with friends, family and people around the world
- Real-time chatting with connected people and combined shopping
- AI-powered product recommendations based on social connections
- **Voice-Powered Eco Assistant**: Use your voice to navigate, search for products, and add items to your cart. Click the microphone icon in the header to get started.

---
## Live Website Link
  - **https://socialcart.netlify.app/**
  - login feature is not available across browsers as the prototype uses the browser database for userprofile storage.
  - Signup with random dummy credentials as the prototype has no password restrictions.
  - sample credentials
  -    **Name**     : person1
  -    **Username** : user1
  -    **Password** : abc
## Running Locally

To run this project on your own computer, you'll need [Node.js](https://nodejs.org/) installed.

### 1. Install Dependencies
Open your terminal in the project directory. The necessary packages will be installed automatically when you start the development server.

### 2. Set Up Environment Variables
The AI features in this app use the Google AI API. You will need to provide your API key.

1.  Create a new file in the root of the project named `.env`.
2.  Add the following line to the file, replacing the placeholder with your key:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```

### 3. Run the App 

- **Terminal 1: Next.js Web App**
  Run the following command to start the main website:
  ```bash
  npm install next
  npm run build
  npm run starts
  ```
  Your site will be available at `http://localhost:3000`.

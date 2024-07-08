# Hotel Booking Chatbot

This project is a simplified hotel booking chatbot implemented using Express.js, OpenAI's API, and SQLite with Sequelize for conversation history storage. The chatbot helps users book hotel rooms by fetching available room options and simulating the booking process.

## Table of Contents

- [Project Setup](#project-setup)
- [API Endpoints](#api-endpoints)
- [Conversation Flow](#conversation-flow)
- [Testing the Chatbot](#testing-the-chatbot)
- [Frontend Interface](#frontend-interface)
- [Video Demo](#video-demo)
- [License](#license)

## Project Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/hotel-booking-chatbot.git
    cd hotel-booking-chatbot
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the project root and add your OpenAI API key:

    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4. Start the server:

    ```bash
    node app.js
    ```

    The server will start running on `http://localhost:3000`.

## API Endpoints

### POST /chat

Send a message to the chatbot and receive a response.

#### Request Body

```json
{
  "userId": "user123",
  "message": "I want to book a room"
}

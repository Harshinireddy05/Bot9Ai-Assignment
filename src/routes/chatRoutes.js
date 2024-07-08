const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { getChatCompletion } = require('../services/openaiService');
const { getRoomOptions, bookRoom } = require('../services/roomService');

router.post('/chat', async (req, res) => {
  const { userId, message } = req.body;

  try {
    let conversation = await Conversation.findOne({ where: { userId } });
    if (!conversation) {
      conversation = await Conversation.create({ userId, messages: '[]' });
    }

    const messages = JSON.parse(conversation.messages);
    messages.push({ role: 'user', content: message });

    const functions = [
      {
        name: "get_room_options",
        description: "Get available room options",
        parameters: { type: "object", properties: {} }
      },
      {
        name: "book_room",
        description: "Book a room",
        parameters: {
          type: "object",
          properties: {
            roomId: { type: "number" },
            fullName: { type: "string" },
            email: { type: "string" },
            nights: { type: "number" }
          },
          required: ["roomId", "fullName", "email", "nights"]
        }
      }
    ];

    const assistantMessage = await getChatCompletion(messages, functions);

    if (assistantMessage.function_call) {
      let functionResult;
      if (assistantMessage.function_call.name === "get_room_options") {
        functionResult = await getRoomOptions();
      } else if (assistantMessage.function_call.name === "book_room") {
        const { roomId, fullName, email, nights } = JSON.parse(assistantMessage.function_call.arguments);
        functionResult = await bookRoom(roomId, fullName, email, nights);
      }

      messages.push(assistantMessage);
      messages.push({
        role: "function",
        name: assistantMessage.function_call.name,
        content: JSON.stringify(functionResult)
      });

      const secondAssistantMessage = await getChatCompletion(messages);
      assistantMessage.content = secondAssistantMessage.content;
    }

    messages.push(assistantMessage);
    await conversation.update({ messages: JSON.stringify(messages) });

    res.json({ response: assistantMessage.content });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
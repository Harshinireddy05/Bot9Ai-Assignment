const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getChatCompletion(messages, functions = null) {
    const completionOptions = {
      model: "gpt-3.5-turbo", 
      messages: [
        { role: "system", content: "You are a helpful assistant for a hotel booking chatbot." },
        ...messages
      ]
    };
  
    if (functions) {
      completionOptions.functions = functions;
      completionOptions.function_call = "auto";
    }
  
    const completion = await openai.chat.completions.create(completionOptions);
    return completion.choices[0].message;
  }

module.exports = { getChatCompletion };
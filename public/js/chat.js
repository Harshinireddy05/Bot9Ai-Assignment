const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const userId = 'user' + Math.floor(Math.random() * 1000);

function addMessage(role, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', role === 'user' ? 'user-message' : 'bot-message');
    
    const iconElement = document.createElement('i');
    iconElement.classList.add('fas', role === 'user' ? 'fa-user' : 'fa-robot');
    
    const textElement = document.createElement('span');
    textElement.textContent = content;
    
    messageElement.appendChild(iconElement);
    messageElement.appendChild(textElement);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage('user', message);
        userInput.value = '';
        userInput.focus();

        // Add loading indicator
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('message', 'bot-message');
        loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Thinking...';
        chatMessages.appendChild(loadingElement);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, message }),
            });

            const data = await response.json();
            
            // Remove loading indicator
            chatMessages.removeChild(loadingElement);
            
            addMessage('bot', data.response);
        } catch (error) {
            console.error('Error:', error);
            
            // Remove loading indicator
            chatMessages.removeChild(loadingElement);
            
            addMessage('bot', 'Sorry, an error occurred. Please try again.');
        }
    }

}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Add a welcome message when the page loads
window.addEventListener('load', () => {
    addMessage('bot', 'Welcome to the Hotel Room Booking Chatbot! How can I assist you today?');
});
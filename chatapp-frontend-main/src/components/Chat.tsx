import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css'; // Import the CSS file

const socket = io('http://localhost:5000');
var sender;
const Chat: React.FC<{ user: string; }> = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Array<{ sender: string, message: string }>>([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);

  const sendMessage = async () => {
    const response = await axios.get('http://localhost:5000/api/users/session', { withCredentials: true });
    sender = response.data.user.username;
    const receiver = 'User2'; // Replace with the other user's ID
    socket.emit('send_message', { sender, receiver, message });
    setChat([...chat, { sender, message }]);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <h3 className="chat-title">Chat</h3>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`chat-message-container ${msg.sender === sender ? 'sent' : 'received'}`}
          >
            <div className="chat-message-block">
              <strong className="chat-message-sender">{msg.sender}</strong>
              <p className="chat-message-text">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="chat-send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;

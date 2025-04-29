import React, { useEffect, useState, useRef } from 'react';
import { socket } from './socket';

function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: "",
  });
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const onConnection = () => {
    console.log("Socket connected");
  }

  const onDisconnection = () => {
    console.log("Socket disconnected");
    socket.disconnect();
  }

  const onBroadcast = (data) => {
    setMessages((messages) => [...messages, data]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    if (message === "") return;
    e.target.message.value = '';
    const data = {
      content: message,
      author: user.name
    };
    socket.emit('message', data);
    setMessages((messages) => [...messages, data]);
  }

  const handleSignin = (e) => {
    e.preventDefault();
    const userName = e.target.username.value.trim();
    if (userName === "") return;
    e.target.username.value = '';
    setUser({
      isLoggedIn: true,
      name: userName
    });
  }

  useEffect(() => {
    socket.on('connect', onConnection);
    socket.on('disconnect', onDisconnection);
    socket.on('broadcast', onBroadcast);

    return () => {
      socket.off('connect', onConnection);
      socket.off('disconnect', onDisconnection);
      socket.off('broadcast', onBroadcast);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {!user.isLoggedIn ? (
        <form onSubmit={handleSignin} className="signin-form">
          <h2>Join the Chat</h2>
          <input type="text" name="username" placeholder="Enter your username" />
          <button type="submit">Join</button>
        </form>
      ) : (
        <>
          <header className="chat-header">
            <h3>Welcome, {user.name}!</h3>
          </header>

          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.author === user.name ? 'own' : 'other'}`}
              >
                <div className="message-author">{message.author}</div>
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <input type="text" name="message" placeholder="Type a message..." autoComplete="off" />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;

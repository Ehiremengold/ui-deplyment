import React, { useState, useEffect, useRef } from 'react';

import SendButton from '../components/SendButton';
import { useNavigate } from 'react-router-dom';
import TeamHeader from '../components/TeamHeader';
import { AnimatePresence } from 'framer-motion';
// eslint-disable-next-line no-unused-vars
import {motion} from 'framer-motion';
const Env = "Prod" // or "Dev"

const websocketUrl = () => { 
  return Env === "Prod" ? 'wss://sbsc-project-server.onrender.com' : 'ws://localhost:8000'
}

const Collaboration = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Get user name from localStorage
  const name = localStorage.getItem('userName');
  const avatar = localStorage.getItem('userAvatar');

  useEffect(() => {
    
    const socket = new WebSocket(websocketUrl());

    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket Connected');
      console.log('WebSocket Ready State:', socket.readyState); // debugging line
    };

    socket.onmessage = async (event) => {
      const dataText =
        event.data instanceof Blob ? await event.data.text() : event.data;
      try {
        const data = JSON.parse(dataText);

        switch (data.type) {
          case 'INIT':
            console.log('INIT received:', data.messages);
            setMessages(data.messages);
            break;

          case 'NEW_MESSAGE':
            setMessages((prev) => [...prev, data.message]);
            break;

          case 'EDIT_MESSAGE':
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.id ? { ...msg, text: data.newText } : msg
              )
            );
            break;

          case 'DELETE_MESSAGE':
            setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
            break;

          case 'CLEAR_ALL':
            setMessages([]);
            break;

          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (err) {
        console.error('Failed to parse message', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      alert("The chat server might be waking up. Please wait a few seconds and refresh.");
    };

    // WebSocket connection closed
    socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    // Cleanup WebSocket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [avatar, name, navigate]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSend = () => {
    if (text.trim()) {
      sendMessage({ type: 'SEND', user: name || '', message: text });
      setText('');
    }
  };

  const handleEdit = (id, oldText) => {
    const newText = prompt('Edit your message:', oldText);
    if (newText) {
      sendMessage({ type: 'EDIT', id, newText });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      sendMessage({ type: 'DELETE', id });
    }
  };


  const sendMessage = (data) => {
    // Retrieve avatar and user name from localStorage
    const userName = localStorage.getItem('userName');
    const avatarUrl = localStorage.getItem(`avatar-${userName}`);

    // Ensure the user has a name and avatar
    if (!userName || !avatarUrl) {
      console.warn('User name or avatar is missing!');
      return;
    }

    // Add userName and avatar to the message data
    const messageData = {
      ...data,
      user: userName,
      avatar: avatarUrl,
    };

    // Check if WebSocket is ready
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not ready. Message not sent:', messageData);
      return;
    }

    // Send the message with the user and avatar info
    socketRef.current.send(JSON.stringify(messageData));
  };

  return (
    <motion.main
      className="flex flex-col gap-10 h-screen max-w-4xl mx-auto my-auto place-items-center mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <motion.p
          className="text-[#2E3060] text-xl lg:text-3xl font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Share <span className="font-bold">&#183;</span> Collaborate{' '}
          <span className="font-bold">&#183;</span> Build
        </motion.p>
      </div>

      <div className="border border-gray-300 w-4/5 h-[800px] p-3 relative">
        <TeamHeader sendMessage={sendMessage} />
        <div className="h-[2px] bg-[#F26722] w-full mt-2"></div>

        {/* Real-time message display */}
        <div className="h-[620px] overflow-y-scroll mt-5 flex flex-col gap-3 scroll-smooth scrollbar-thin scrollbar-thumb-[#F26722] scrollbar-track-[#F26722]/20">
          {messages.length === 0 && (
            <motion.div
              className="text-center text-gray-500 font-semibold mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p>Nothing Here Yet. Start a conversation!</p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex items-center gap-3 ${
                  message.user === name ? 'justify-end' : 'justify-start'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={message.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="bg-[#F26722] text-white p-3 rounded-2xl max-w-[70%] shadow-md space-y-1">
                  <p className="font-medium break-words">{message.text}</p>

                  <div className="flex justify-between items-center text-xs text-gray-200 gap-9">
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {message.user === name && (
                      <div className="space-x-2 text-right">
                        <button
                          onClick={() => handleEdit(message.id, message.text)}
                          className="transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(message.id)}
                          className="transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Text input for sending messages */}
        <motion.div
          className="flex bg-white pt-3 justify-end items-center gap-4 absolute bottom-5 right-3 left-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <textarea
            ref={inputRef}
            className="border border-gray-300 flex-1 h-10 p-2 rounded-md shadow-sm outline-[#F26722] resize-none scroll-none"
            value={text}
            placeholder="Start typing..."
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSend();
                e.preventDefault(); // Prevents the default behavior of adding a new line
              }
            }}
          />
          <SendButton onClick={handleSend} />
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Collaboration;

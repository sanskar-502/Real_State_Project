import { useContext, useEffect, useRef, useState, useMemo } from "react";
import "./chat.scss";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { AuthContext } from "../../context/AuthContext";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const uniqueChats = useMemo(() => {
    if (!chats) return [];
    
    const chatsByReceiver = new Map();
    
    chats.forEach(chat => {
      if (!chat.receiver || !chat.receiver.id) return; 
      
      const existingChat = chatsByReceiver.get(chat.receiver.id);
      if (!existingChat || new Date(chat.updatedAt) > new Date(existingChat.updatedAt)) {
        chatsByReceiver.set(chat.receiver.id, chat);
      }
    });
    
    return Array.from(chatsByReceiver.values());
  }, [chats]);

  const messageEndRef = useRef();
  const chatCenterRef = useRef(); // New ref for the scrollable div

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    if (chat?.messages?.length && chatCenterRef.current) {
      setTimeout(() => {
        chatCenterRef.current.scrollTop = chatCenterRef.current.scrollHeight;
      }, 0);
    }
  }, [chat?.messages?.length]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        <div>
          {uniqueChats.map((c) => (
            <div
              className={`message ${chat?.id === c.id ? 'active' : ''}`}
              key={c.id}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="" />
              <div className="message-content">
                <span>{c.receiver?.username || "User not found"}</span>
                <p>{c.lastMessage || "Start a conversation..."}</p>
              </div>
              {c.receiver && !c.seenBy.includes(currentUser.id) && (
                <div className="unread-indicator">
                  {c.messages?.filter(m => !c.seenBy.includes(currentUser.id) && m.userId !== currentUser.id).length || 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center" ref={chatCenterRef}>
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;

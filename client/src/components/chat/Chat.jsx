import { useContext, useEffect, useRef, useState, useMemo } from "react";
import "./chat.scss";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { AuthContext } from "../../context/AuthContext";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const [localChats, setLocalChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  // Update local chats when chats prop changes
  useEffect(() => {
    if (chats) {
      const chatsByReceiver = new Map();
      
      chats.forEach(chat => {
        if (!chat.receiver || !chat.receiver.id) return; 
        
        const existingChat = chatsByReceiver.get(chat.receiver.id);
        if (!existingChat || new Date(chat.updatedAt) > new Date(existingChat.updatedAt)) {
          chatsByReceiver.set(chat.receiver.id, chat);
        }
      });
      
      setLocalChats(Array.from(chatsByReceiver.values()));
    }
  }, [chats]);

  const uniqueChats = localChats;

  const messageEndRef = useRef();
  const chatCenterRef = useRef(); // New ref for the scrollable div

  const decrease = useNotificationStore((state) => state.decrease);
  const decreaseBy = useNotificationStore((state) => state.decreaseBy);
  const sync = useNotificationStore((state) => state.sync);

  useEffect(() => {
    if (chat?.messages?.length && chatCenterRef.current) {
      setTimeout(() => {
        chatCenterRef.current.scrollTop = chatCenterRef.current.scrollHeight;
      }, 0);
    }
  }, [chat?.messages?.length]);

  const handleOpenChat = async (id, receiver) => {
    try {
      // Get the current chat to check if it has unread messages
      const currentChatData = uniqueChats.find(c => c.id === id);
      const hasUnreadMessages = currentChatData && !currentChatData.seenBy.includes(currentUser.id);
      
      const res = await apiRequest("/chats/" + id);
      
      // Calculate how many unread messages were in this chat
      if (hasUnreadMessages) {
        const unreadCount = res.data.messages.filter(msg => 
          msg.userId !== currentUser.id && 
          (!msg.seenBy || !msg.seenBy.includes(currentUser.id))
        ).length;
        
        // Mark the chat as read on the server
        try {
          await apiRequest.put("/chats/read/" + id);
        } catch (err) {
          console.error("Error marking chat as read:", err);
        }
        
        // Update local chat list to mark this chat as seen
        setLocalChats(prevChats => 
          prevChats.map(c => 
            c.id === id 
              ? { ...c, seenBy: [...c.seenBy, currentUser.id] }
              : c
          )
        );
        
        // Decrease notification count by the number of unread messages
        if (unreadCount > 0) {
          decreaseBy(unreadCount);
        } else {
          // If no specific unread messages found, but chat was marked as unread, decrease by 1
          decrease();
        }
        
        // Sync with server after a delay to ensure accuracy
        setTimeout(() => {
          sync();
        }, 1000);
      }
      
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text || !text.trim()) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text: text.trim() });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.target.closest('form');
      if (form) {
        const text = e.target.value.trim();
        if (text) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.error(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
          // Decrease notification count for new message that was immediately read
          decrease();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat, decrease]);

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
            <textarea 
              name="text" 
              placeholder="Type your message..."
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ resize: 'none', overflow: 'hidden' }}
              onInput={(e) => {
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            ></textarea>
            <button type="submit">
              <span className="desktop-text">Send</span>
              <span className="mobile-icon">⮕</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;

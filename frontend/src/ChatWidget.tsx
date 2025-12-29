import { useState, useEffect, useRef } from "react";
import "./ChatWidget.css";

type Message = {
  role: "user" | "ai";
  content: string;
  timestamp?: Date;
};

type BackendMessage = {
  sender: "user" | "ai";
  text: string;
  createdAt?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Load session + history
  useEffect(() => {
    const storedSession = localStorage.getItem("sessionId");
    if (storedSession) {
      setSessionId(storedSession);
      fetchHistory(storedSession);
    }
  }, []);

  // Scroll to bottom whenever messages, loading, or open changes
  useEffect(() => {
    const scrollToBottom = () => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };
    const frame = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(frame);
  }, [messages, loading, open]);

  const toggleOpen = () => setOpen((prev) => !prev);

  const fetchHistory = async (session: string) => {
    try {
      const res = await fetch(`${API_URL}/history?sessionId=${session}`);
      const data = await res.json();
      if (!data.messages) return;

      const mapped: Message[] = data.messages.map((msg: BackendMessage) => ({
        role: msg.sender === "user" ? "user" : "ai",
        content: msg.text,
        timestamp: msg.createdAt ? new Date(msg.createdAt) : undefined,
      }));

      setMessages(mapped);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Failed to load chat history." },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      // Handle non-200 responses
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg =
          errData?.error || "Server failed to respond. Please try again.";
        setMessages((prev) => [...prev, { role: "ai", content: msg }]);
        return;
      }

      const data = await res.json();

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }

      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error talking to server. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button className="chat-toggle-btn" onClick={toggleOpen}>
          <img
            src="https://spur-uploads.s3.ap-south-1.amazonaws.com/360/7799_spurlogobluebg.svg"
            alt="Chat"
          />
        </button>
      )}

      <div className={`chat-widget ${open ? "open" : ""}`}>
        <div className="chat-header" onClick={toggleOpen}>
          <span>Spur AI Chat</span>
          <button className="close-btn">−</button>
        </div>

        {open && (
          <div className="chat-body">
            <div className="messages" ref={messagesContainerRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.role === "user" ? "user" : "ai"}`}
                >
                  <img
                    className="avatar"
                    src={
                      msg.role === "user"
                        ? "https://cdn-icons-png.flaticon.com/512/616/616411.png"
                        : "https://cdn-icons-png.flaticon.com/512/4712/4712014.png"
                    }
                    alt={msg.role}
                  />
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}

              {loading && (
                <div className="message ai">
                  <img
                    className="avatar"
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712014.png"
                    alt="ai"
                  />
                  <div className="message-content">AI is typing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import ChatWidget from "./ChatWidget";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to Spur AI</h1>
          <p>
            Your smart assistant for customer support and interactive AI chat.
            Engage with your customers seamlessly and enhance their experience.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>AI Chat</h3>
              <p>
                Interactive AI chat that responds in real-time to your users.
              </p>
            </div>
            <div className="feature-card">
              <h3>Customer Support</h3>
              <p>
                Automate support with AI-trained knowledge of your store and
                policies.
              </p>
            </div>
            <div className="feature-card">
              <h3>Easy Integration</h3>
              <p>
                Connect Spur AI with your website in minutes, no heavy setup
                required.
              </p>
            </div>
            <div className="feature-card">
              <h3>Analytics</h3>
              <p>
                Track conversations and get insights to improve customer
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Spur AI. All rights reserved.</p>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

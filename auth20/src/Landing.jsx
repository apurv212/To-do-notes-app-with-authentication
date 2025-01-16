import { useAuth0 } from "@auth0/auth0-react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import './Landing.css';

function Landing() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [isDark, setIsDark] =  useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <header>
        <h3>Note App</h3>
        <button 
          className="theme-btn"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>
      {isAuthenticated ? (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button className="ra" 
            onClick={() => logout({ 
              logoutParams: { returnTo: window.location.origin } 
            })}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="button-container">
        <button className="ra" onClick={() => loginWithRedirect()}>
          Click here for signup or login
        </button>
      </div>
      )}
      <main className="main-content">
        <h3>Features</h3>
        <ul className="features-list">
          <li>📝 Easy to create and organize notes</li>
          <li>🔍 Quick search to find notes instantly</li>
          <li>🔒 separate lock for each note</li>
          <li>📌 pin ur notes </li>
          <li>🌐 use it any where</li>
          <li>↗️ share ur notes (future) </li>
          <li>🎤 voice to text (future) </li>

        </ul>
      </main>
    </div>
  );
}

export default Landing;
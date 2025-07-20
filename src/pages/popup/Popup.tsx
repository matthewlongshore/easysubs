// --- src/pages/popup/Popup.tsx ---

import React, { useState, useEffect } from 'react';

// The domain of your main web application
const LILOCHAT_DOMAIN = "https://lilochat.com";

const Popup = () => {
  // State to manage the UI: 'loading', 'loggedIn', or 'loggedOut'
  const [authState, setAuthState] = useState('loading');

  // This function runs when the popup is opened
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Call your new endpoint to get the JWT
        const response = await fetch(`${LILOCHAT_DOMAIN}/api/auth/session-for-extension`);

        if (response.ok) {
          const data = await response.json();
          if (data.jwt) {
            // SUCCESS: Store the token and update the UI
            await chrome.storage.local.set({ authToken: data.jwt });
            setAuthState('loggedIn');
            console.log("LiloChat session is active. Token stored.");
          }
        } else {
          // User is not logged in on the website
          await chrome.storage.local.remove("authToken");
          setAuthState('loggedOut');
          console.log("No active LiloChat session found.");
        }
      } catch (error) {
        // Network error or the site is down
        console.error("Error checking LiloChat session:", error);
        setAuthState('loggedOut'); // Default to logged out on error
      }
    };

    checkSession();
  }, []); // The empty array [] ensures this runs only once when the popup opens

  const handleLogin = () => {
    // Open the LiloChat login page in a new tab
    chrome.tabs.create({ url: `${LILOCHAT_DOMAIN}/signin` });
  };

  const handleLogout = async () => {
    // Clear the token from storage and update the UI
    await chrome.storage.local.remove("authToken");
    setAuthState('loggedOut');
    // Optional: You could also open the LiloChat logout page
    // chrome.tabs.create({ url: `${LILOCHAT_DOMAIN}/api/auth/signout` });
  };

  const renderContent = () => {
    switch (authState) {
      case 'loading':
        return <p>Checking LiloChat session...</p>;
      case 'loggedIn':
        return (
          <>
            <p className="status-text">You are logged in to LiloChat!</p>
            <button onClick={handleLogout} className="action-button">Logout</button>
          </>
        );
      case 'loggedOut':
      default:
        return (
          <>
            <p className="status-text">Please log in to LiloChat to save words.</p>
            <button onClick={handleLogin} className="action-button">Login to LiloChat</button>
            <p className="small-text">This will open your LiloChat homepage. After you log in, please reopen this popup.</p>
          </>
        );
    }
  };

  return (
    <div className="content">
      <div className="header">Easysubs & LiloChat</div>
      <div className="auth-section">
        {renderContent()}
      </div>
      <hr />
      <menu>
        <li><a target="_blank" href="https://easysubs.cc" rel="noreferrer">Easysubs Home</a></li>
        <li><a target="_blank" href="https://github.com/Nitrino/easysubs" rel="noreferrer">GitHub</a></li>
        <li><a target="_blank" href="https://t.me/easysubs_ext" rel="noreferrer">Support Chat</a></li>
      </menu>
    </div>
  );
};

export default Popup;

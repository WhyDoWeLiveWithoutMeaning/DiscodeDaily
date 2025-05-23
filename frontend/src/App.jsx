import { useState, useEffect } from 'react';
import { problems }  from './TempProblems.js';
import { getUser } from './lib/UserContext.jsx';

import { getAccessToken, getUserInfo } from './utils/getAuthCode.js';

import { openDiscordAuthPopup } from './utils/discordAuthPopup.js';

import Editor from "@monaco-editor/react";


function App() {
  const [selectedProblem, setSelectedProblem] = useState(problems[Math.floor(Math.random() * problems.length)]);
  const { user, loading, inDiscord, setUser } = getUser();

  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = localStorage.getItem('discode_access_token');
      const userData = localStorage.getItem('discode_user_data');

      if (accessToken && !user) {
        try {
          if (userData) {
            setUser(JSON.parse(userData)); // use cached user data
          } else {
            const fetchedUser = await getUserInfo(accessToken);
            setUser(fetchedUser);
            localStorage.setItem('discode_user_data', JSON.stringify(fetchedUser));
          }
        } catch (err) {
          console.error("Failed to load user from localStorage or API:", err);
          localStorage.removeItem('discode_access_token');
          localStorage.removeItem('discode_user_data');
        }
      }

      // Always select a random problem on mount
      setSelectedProblem(problems[Math.floor(Math.random() * problems.length)]);
    };

    initializeUser();
  }, []);

  const handleDiscordLogin = async () => {
    try {
      setAuthLoading(true);
      const code = await openDiscordAuthPopup();
      console.log("Got authorization code:", code);
      
      const access_token = await getAccessToken(code);
      
      console.log("Got access token:", access_token);

      localStorage.setItem('discode_access_token', access_token);
      
      const userData = await getUserInfo(access_token);
      localStorage.setItem('discode_user_data', JSON.stringify(userData));

      console.log("Got user data:", userData);
      // Update user context with the authenticated user data
      if (setUser) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      // Show error notification to user
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-6">
      {user && (
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <img
            src={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/0.png`
            }
            alt="User avatar"
            className="w-12 h-12 rounded-full border border-white"
          />
          <span className="text-lg font-medium">{user.username}</span>
        </div>
      )}
      {
        !inDiscord && !user && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleDiscordLogin}
              disabled={authLoading}
              className={`${
                authLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded flex items-center gap-2`}
            >
              {authLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login with Discord'
              )}
            </button>
          </div>
        )
      }
      <h1 className="text-6xl font-bold text-center mb-8">Discode Daily</h1>

      {/* Side-by-side layout for problem and editor */}
      <div className="flex justify-center gap-6">
        {/* Problem description panel */}
        <div className="h-[65vh] w-[40%] border rounded-lg overflow-y-auto p-4 bg-gray-800">
          <h2 className="text-2xl font-semibold mb-2">{selectedProblem.title}</h2>
          <p className="text-sm whitespace-pre-line mb-4">{selectedProblem.description}</p>
          <h3 className="text-lg font-medium mb-1">Constraints:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {selectedProblem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Code editor */}
        <div className="h-[65vh] w-[40%] border rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            defaultValue={selectedProblem.initialCode}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false
            }}
            onChange={(value) => {
              console.log(user);
            }}
          />
        </div>
      </div>

      {/* Submit button centered below */}
      <div className="flex justify-center mt-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
          Submit
        </button>
      </div>
    </div>
  )
}
export default App

import { useState, useEffect, useContext} from 'react';
import { problems }  from './TempProblems.js';
import { UserContext } from './lib/UserContext.jsx';
import Editor from "@monaco-editor/react";


function App() {
  const [selectedProblem, setSelectedProblem] = useState(problems[Math.floor(Math.random() * problems.length)]);
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    // Fetch problems from the backend or use a static list
    // For now, we are using a static list from TempProblems.js
    // In the future, you can replace this with an API call to fetch problems
    setSelectedProblem(problems[Math.floor(Math.random() * problems.length)]);
  }, [user]);

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

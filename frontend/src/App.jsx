import { useState, useEffect } from 'react';
import { problems }  from './TempProblems.js';
import { useDiscordSDK } from './hooks/useDiscordSDK.js';

import Editor from "@monaco-editor/react";


function App() {
  // Initialize Discord SDK
  const discordUser = useDiscordSDK();
  const [selectedProblem, setSelectedProblem] = useState(problems[Math.floor(Math.random() * problems.length)]);

  useEffect(() => {
    if (discordUser) {
      console.log("Discord user:", discordUser);
    }
  }, [discordUser]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-6">
      {/* Title centered at the top */}
      <h1 className="text-6xl font-bold text-center mb-8">Discode Daily {discordUser ? discordUser.username : "Guest"}</h1>

      {/* Side-by-side layout for problem and editor */}
      <div className="flex justify-center gap-6">
        {/* Problem description panel */}
        <div className="h-[500px] w-[40%] border rounded-lg overflow-y-auto p-4 bg-gray-800">
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
        <div className="h-[500px] w-[40%] border rounded-lg overflow-hidden">
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

import { useState, useEffect } from 'react';
import { problems }  from './TempProblems.js';
import { useDiscordSDK } from './hooks/useDiscordSDK.js';

import Editor from "@monaco-editor/react";


function App() {
  // Initialize Discord SDK
  const discordUser = useDiscordSDK();
  const [selectedProblem] = useState(problems[Math.floor(Math.random(2) * problems.length)]);
  const [code, setCode] = useState(selectedProblem.initialCode);


  const [output, setOutput] = useState(""); // for output message
  const [error, setError] = useState("");   // for error message


  useEffect(() => {
    if (discordUser) {
      console.log("Discord user:", discordUser);
    }
  }, [discordUser]);


  // handles the submit button and passes it to the Java file
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: discordUser?.username || "Guest",
          code: code,
          language: "71"
        })
      });

      const result = await response.json();

      // Spring boot returns an OK if the server connects
      // If server is good it either gets the output from the Springboot server or defaults to no output
      if (response.ok) {
        setOutput(result.message || "No output recieved");
        setError("");
      } else {
        setError(result.error || "Something went wrong.");
        setOutput("");
      }

      console.log("Server Response: ", result);
    } catch (error) {
      console.error("Error Submitting Code: ", error);
      setError("Server Connection Failed");
      setOutput("");
    }
  }


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
            onChange={(value) => setCode(value)}
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
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        onClick={handleSubmit}>
          Submit
        </button>
      </div>
      

      {/* Handles what ever is added to the output from the backend */}
      {output && (
        <div className="mt-4 text-center bg-green-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Output:</h2>
          <pre className="text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      )}
            
      {/* If there is an error this will display */}
      {error && (
        <div className="mt-4 text-center bg-red-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Error:</h2>
          <pre className="text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>



   
  )
}
export default App

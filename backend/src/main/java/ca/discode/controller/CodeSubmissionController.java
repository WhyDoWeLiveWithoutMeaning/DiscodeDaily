package ca.discode.controller;

import ca.discode.entity.CodingProblem;
import ca.discode.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/code")
public class CodeSubmissionController {

    @Autowired
    private CodeExecutionService codeExecutionService;
    
    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> handleCode(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String code = payload.get("code");
        String unittest = payload.get("unittest");

        code = code + "\n\n" + unittest;

        System.out.println("Received code from user: " + username);
        // System.out.println("Code: " + code);
        // System.out.println("Unittest: " + unittest);

        String output = codeExecutionService.executeCode(71, code);

        System.out.println("Execution output: " + output);

        return ResponseEntity.ok(Map.of("message", output));
    }

    @GetMapping("/daily-challenge")
    public ResponseEntity<Map<String, Object>> getDailyChallenge() {
        CodingProblem problem;
        
        try {
            // Simple query to get a random problem
            problem = (CodingProblem) entityManager.createNativeQuery(
                "SELECT * FROM coding_problem ORDER BY RANDOM() LIMIT 1", 
                CodingProblem.class
            ).getSingleResult();
        } catch (NoResultException e) {
            // If no problems exist, create a default one
            problem = new CodingProblem();
            problem.setTitle("Length of Last Word");
            problem.setDescription("Given a string s consisting of words and spaces, return the length of the last word in the string.\n\nA word is a maximal substring consisting of non-space characters only.");
            problem.setConstraints(Arrays.asList(
                "1 <= s.length <= 10^4", 
                "s consists of only English letters and spaces ' '",
                "There will be at least one word in s"
            ));
            problem.setInitialCode("def lengthOfLastWord(s):\n    # your code here\n    pass");
            problem.setUnitTest("\n\nimport unittest\n\nclass TestLengthOfLastWord(unittest.TestCase):\n    def test_basic_case(self):\n        self.assertEqual(lengthOfLastWord(\"Hello World\"), 5)\n    \n    def test_trailing_spaces(self):\n        self.assertEqual(lengthOfLastWord(\"   fly me   to   the moon  \"), 4)\n    \n    def test_single_word(self):\n        self.assertEqual(lengthOfLastWord(\"luffy\"), 5)\n\nif __name__ == '__main__':\n    unittest.main()");
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("title", problem.getTitle());
        response.put("description", problem.getDescription());
        response.put("constraints", problem.getConstraints());
        response.put("initialCode", problem.getInitialCode());
        response.put("unitTest", problem.getUnitTest());
        
        return ResponseEntity.ok(response);
    }
}
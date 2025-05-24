package ca.discode.controller;

import ca.discode.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CodeSubmissionController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> handleCode(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String code = payload.get("code");

        System.out.println("Received code from user: " + username);
        System.out.println("Code: " + code);

        String output = codeExecutionService.executeCode(71, code);

        return ResponseEntity.ok(Map.of("message", output));
    }
}

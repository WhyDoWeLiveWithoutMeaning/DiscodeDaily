package com.example;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class HandleRequests {

    // Retrieves whatever code is entered in the code section
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> handleCode(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String code = payload.get("code");

        System.out.println("User: " + username);
        System.out.println("Code: " + code);

        try {
            App app = new App();
            String output = app.getRequest(71, code);
            System.out.println(output);
            return ResponseEntity.ok(Map.of("message", output));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Execution Failed"));
        }

    }
}

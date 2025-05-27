package ca.discode.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class DiscordAuthController {

    @Value("${DISCORD_CLIENT_ID}")
    private String clientId;

    @Value("${DISCORD_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${DISCORD_REDIRECT_URI}")
    private String redirectUri;

    @PostMapping("/discord")
    public ResponseEntity<?> exchangeCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");

        System.out.println("Received code: " + code);
        
        if (code == null || code.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "No authorization code provided"));
        }
        
        try {
            // Step 1: Exchange code for access token
            Map<String, String> tokenResponse = exchangeCodeForToken(code);
            
            // Step 2: Get user info using the access token
            Map<String, Object> userInfo = getUserInfo(tokenResponse.get("access_token"));
            
            // Step 3: Create response with user data and token info
            Map<String, Object> response = new HashMap<>();
            response.put("user", userInfo);
            response.put("token_type", tokenResponse.get("token_type"));
            response.put("expires_in", tokenResponse.get("expires_in"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to authenticate: " + e.getMessage()));
        }
    }
    
    private Map<String, String> exchangeCodeForToken(String code) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        String requestBody = String.format(
            "client_id=%s&client_secret=%s&grant_type=authorization_code&code=%s&redirect_uri=%s",
            clientId, clientSecret, code, redirectUri);
            
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("https://discord.com/api/oauth2/token"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();
            
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to exchange code: " + response.body());
        }

        JSONObject jsonResponse = new JSONObject(response.body());
        
        Map<String, String> result = new HashMap<>();
        result.put("access_token", jsonResponse.getString("access_token"));
        result.put("token_type", jsonResponse.getString("token_type"));
        result.put("expires_in", String.valueOf(jsonResponse.getInt("expires_in")));
        
        return result;
    }
    
    private Map<String, Object> getUserInfo(String accessToken) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI("https://discord.com/api/users/@me"))
            .header("Authorization", "Bearer " + accessToken)
            .GET()
            .build();
            
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject userJson = new JSONObject(response.body());
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", userJson.getString("id"));
        userInfo.put("username", userJson.getString("username"));
        userInfo.put("avatar", userJson.optString("avatar", null));
        userInfo.put("discriminator", userJson.optString("discriminator", null));
        userInfo.put("email", userJson.optString("email", null));
        
        return userInfo;
    }
}
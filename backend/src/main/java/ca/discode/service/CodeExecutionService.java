package ca.discode.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class CodeExecutionService {

    @Value("${JUDGE0_URL}")
    private String judge0Url;

    public String executeCode(int languageId, String code) {
    try {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("language_id", languageId);
        jsonObject.put("source_code", code);
        jsonObject.put("stdin", " ");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI(judge0Url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString(), StandardCharsets.UTF_8))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("Judge0 Status: " + response.statusCode());
        System.out.println("Response: " + response.body());

        if (response.statusCode() != 200) {
            return "Judge0 error: " + response.statusCode() + " — response: " + response.body();
        }

        JSONObject jsonResponse = new JSONObject(response.body());

        return jsonResponse.optString("stdout",
                jsonResponse.optString("stderr",
                        jsonResponse.optString("message", "No output received")));

    } catch (Exception e) {
        e.printStackTrace();
        return "Execution error: " + e.getMessage();
    }
}
}
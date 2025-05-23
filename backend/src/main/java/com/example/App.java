package com.example;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.json.JSONObject;

/**
 * Hello world!
 *
 */


public class App 
{
    public String getRequest(int language, String code) throws Exception
    {
        HttpClient client = HttpClient.newHttpClient();

        JSONObject jsonObject = new JSONObject();

        jsonObject.put("language_id", language); // Python 3.8
        jsonObject.put("source_code", code);
        jsonObject.put("stdin", " ");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://judge.er-ic.ca/submissions?base64_encoded=false&wait=true"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString(), StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject jsonResponse = new JSONObject(response.body());

        return jsonResponse.optString("stdout", "No output");
    }
}

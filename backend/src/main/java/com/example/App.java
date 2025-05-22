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
    public static void main( String[] args ) throws Exception
    {
        HttpClient client = HttpClient.newHttpClient();

        JSONObject jsonObject = new JSONObject();

        jsonObject.put("language_id", 71); // Python 3.8
        jsonObject.put("source_code", "print(sum(map(int, input().split())))");
        jsonObject.put("stdin", "1 2 3");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://judge.er-ic.ca/submissions?base64_encoded=false&wait=true"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString(), StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject jsonResponse = new JSONObject(response.body());

        System.out.println("Judge0 Response: " + jsonResponse.get("stdout"));
    }
}

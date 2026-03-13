package top.skiba;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.FileInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.util.Properties;

public class DatabaseUploader {
    private final Properties env = new Properties();

    public void upload(String filename){
        try {
            env.load(new FileInputStream(".env"));
        }
        catch (Exception e) {
            System.out.println("Failed to load env");
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            File jsonFile = new File(filename);
            String jsonBody;
            if (!jsonFile.exists()) {
                System.out.println("File not found: " + jsonFile.getName());
                return;
            } else {
                jsonBody = jsonFile.toString();
            }

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(env.getProperty("SUPABASE_URL") + "?on_conflict=name"))
                    .header("apikey", env.getProperty("SUPABASE_KEY"))
                    .header("Authorization", "Bearer " + env.getProperty("SUPABASE_KEY"))
                    .header("Content-Type", "application/json")
                    .header("Prefer", "resolution=merge-duplicates")
                    .POST(HttpRequest.BodyPublishers.ofFile(Path.of(filename)))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201 || response.statusCode() == 200) {
                System.out.println("Successfully uploaded all products to Supabase");
            } else {
                System.err.println("Upload failed. Status: " + response.statusCode());
                System.err.println("Response: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Error connecting to Supabase: " + e.getMessage());
        }
    }
}

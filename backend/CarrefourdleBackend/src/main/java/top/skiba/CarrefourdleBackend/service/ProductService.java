package com.example.CarrefourdleBackend.service;

import com.example.CarrefourdleBackend.model.GameProduct;
import com.example.CarrefourdleBackend.model.Guess;
import com.example.CarrefourdleBackend.model.Product;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class ProductService {
    @Value("${SUPABASE_URL:MISSING}")
    private String supabaseUrl;

    @Value("${supabase.key:MISSING}")
    private String supabaseKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient client = HttpClient.newHttpClient();

    public Product getProduct(String type, String productName) throws Exception {
        String url;
        if (type.equals("today")) {
            url = supabaseUrl + "/rest/v1/rpc/get_daily_product";
        }
        else if (type.equals("random")) {
            url = supabaseUrl + "/rest/v1/rpc/get_random_product";
        }
        else {
            url = supabaseUrl + "/rest/v1/products?select=*&name=ilike.*" + URLEncoder.encode(productName, StandardCharsets.UTF_8);
        }
        return fetchProduct(url, type);
    }

    public Product fetchProduct(String url, String type) throws Exception {
        HttpRequest request;
        if (type.equals("today")) {
            request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseKey)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
        }
        else {
            request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("apikey", supabaseKey)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .GET()
                    .build();
        }

        Product product = parseProduct(client.send(request, HttpResponse.BodyHandlers.ofString()).body());
        //TODO replace '/' in database and scraper
        product.image_url = getTemporaryImageUrl(product.image_url.replace("\\", "/"));
        return product;
    }

    public Product parseProduct(String jsonFromSupabase) {
        try {
            Product[] products = objectMapper.readValue(jsonFromSupabase, Product[].class);
            return products[0];
        }
        catch (Exception e) {
            System.out.println("Supabase response:" + jsonFromSupabase);
            return null;
        }
    }

    public String getTemporaryImageUrl(String fileName) throws Exception {
        String url = supabaseUrl + "/storage/v1/object/sign/" + fileName;
        String jsonBody = "{\"expiresIn\": 900}"; //15 minutes

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        JsonNode rootNode = objectMapper.readTree(client.send(request, HttpResponse.BodyHandlers.ofString()).body());
        return supabaseUrl + "/storage/v1/" + rootNode.get("signedURL").asText();
    }

    public Guess validateGuess(Guess request) throws Exception {
        Product product = getProduct("", request.productName);
        double diff = request.priceGuess - product.current_price;
        double absoluteDiff = Math.abs(diff);
        
        if (absoluteDiff <= 0.09) {
            request.answer = 0;
            request.priceExact = product.current_price;
        }
        else if (absoluteDiff > product.current_price*0.25) {
            if (request.priceGuess > product.current_price) { request.answer = 2; }
            else { request.answer = -2; }

        }
        else if (absoluteDiff <= product.current_price*0.25) {
            if (request.priceGuess > product.current_price) { request.answer = 1; }
            else { request.answer = -1; }
        }
        else {
            request.answer = 99;
        }
        return request;
    }
}

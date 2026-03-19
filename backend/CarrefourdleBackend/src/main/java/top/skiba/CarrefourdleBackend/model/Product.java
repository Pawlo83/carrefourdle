package top.skiba.CarrefourdleBackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Product {
    public String name;
    public double current_price;
    public String image_url;
    public String source_url;
    public String category;

    public Product() {}

    public Product(String name, double current_price, String image_url, String source_url, String category) {
        this.name = name;
        this.current_price = current_price;
        this.image_url = image_url;
        this.source_url = source_url;
        this.category = category;
    }
}
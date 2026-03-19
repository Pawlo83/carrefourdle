package top.skiba.CarrefourdleBackend.model;

public class GameProduct {
    public String name;
    public String image_url;
    public String source_url;
    public String category;

    public GameProduct(Product product) {
        this.name = product.name;
        this.image_url = product.image_url;
        this.source_url = product.source_url;
        this.category = product.category;
    }
}

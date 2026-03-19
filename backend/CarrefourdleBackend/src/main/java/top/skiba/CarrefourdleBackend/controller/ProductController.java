package top.skiba.CarrefourdleBackend.controller;

import top.skiba.CarrefourdleBackend.model.GameProduct;
import top.skiba.CarrefourdleBackend.model.Guess;
import top.skiba.CarrefourdleBackend.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:4200") //TODO
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/random")
    public GameProduct getRandomProduct() throws Exception {
        return new GameProduct(productService.getProduct("random", ""));
    }

    @GetMapping("/today")
    public GameProduct getTodaysProduct() throws Exception {
        return new GameProduct(productService.getProduct("today", ""));
    }

    @GetMapping
    public GameProduct getProduct() throws Exception {
        return new GameProduct(productService.getProduct("", "Dawtona Mus truskawki jabłka 180 g")); //TODO
    }

    @PostMapping("/guess")
    public Guess checkProductPrice(@RequestBody Guess request) throws Exception {
        return productService.validateGuess(request);
    }
}

package top.skiba;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.File;
import java.io.FileInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

public class Scraper {
    private final Properties env = new Properties();

    public void scrape(String url) {
        try {
            env.load(new FileInputStream(".env"));
        }
        catch (Exception e) {
            System.out.println("Failed to load env");
        }

        List<Product> products;

        products = getProducts(url);
        products = downloadProductImages(products);
        saveToJson(products);
    }

    public List<Product> getProducts(String url) {
        Map<String, Product> products = new HashMap<>();

        ChromeOptions options = new ChromeOptions();
        options.setBinary(env.getProperty("BROWSER_PATH"));
        WebDriver driver = new ChromeDriver(options);
        JavascriptExecutor js = (JavascriptExecutor) driver;

        try {
            driver.get(url);
            Thread.sleep(1000);

            List<WebElement> cards = driver.findElements(By.cssSelector("div[class*='jss316']"));

            for (WebElement card : cards) {
                try {
                    js.executeScript("arguments[0].scrollIntoView(true);", card);
                    Thread.sleep(100);

                    String name = card.findElement(By.tagName("h3")).getText();
                    String price = card.findElement(By.cssSelector("div[class*='jss349']")).getText();
                    String image = card.findElement(By.cssSelector("img")).getAttribute("src");

                    //System.out.println("Name: " + name + ", Price: " + cleanPrice(price) + ", Image: " + image);
                    if (products.containsKey(name) && products.get(name).current_price < (cleanPrice(price))){
                        System.out.println(name + " skipped...");
                    }
                    else {
                        products.put(name, new Product(name, cleanPrice(price), image, url, url.substring(25)));
                    }
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    continue;
                }
            }

        } catch (Exception e) {
            System.out.println("Scraping failed: " + e.getMessage());
        } finally {
            driver.quit();
        }
        return new ArrayList<>(products.values());
    }

    public List<Product> downloadProductImages(List<Product> products){
        try {
            Files.createDirectories(Paths.get("images"));
            Files.createDirectories(Paths.get("images/"+products.getFirst().category));
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }

        for (Product product : products) {
            try {
                String safeName;

                safeName = product.name.toLowerCase()
                                       .replaceAll("[ ]", "_")
                                       .replaceAll("[.]", "")
                                       .replaceAll("[%]", "proc")
                                       .replaceAll("[-]", "_");
                safeName = safeName.replaceAll("ą", "a")
                        .replaceAll("ć", "c")
                        .replaceAll("ę", "e")
                        .replaceAll("ł", "l")
                        .replaceAll("ń", "n")
                        .replaceAll("ó", "o")
                        .replaceAll("ś", "s")
                        .replaceAll("ź", "z")
                        .replaceAll("ż", "z")
                        .replaceAll("é", "e");
                safeName+=".jpg";

                Path targetPath = Paths.get("images/"+product.category, safeName);
                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder().uri(URI.create(product.image_url)).header("User-Agent", "Mozilla/5.0").build();
                HttpResponse<Path> response = client.send(request, HttpResponse.BodyHandlers.ofFile(targetPath));
                System.out.println("Downloaded image: " + product.image_url);
                product.image_url = targetPath.toString();
            } catch (Exception e) {
                System.err.println("Failed to download " + product.image_url + ": " + e.getMessage());
                continue;
            }
        }
        return products;
    }

    public void saveToJson(List<Product> products) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            File file = new File("products_"+products.getFirst().category+".json");

            mapper.writerWithDefaultPrettyPrinter().writeValue(file, products);

            System.out.println("Successfully saved " + products.size() + " products to products_"+products.getFirst().category+".json");

        } catch (Exception e) {
            System.err.println("Failed to save JSON: " + e.getMessage());
        }
    }

    public double cleanPrice(String raw) {
        String cleaned = raw.replaceAll("[^0-9\\n]", "").trim().replaceAll("\\n", ".");
        return Double.parseDouble(cleaned);
    }
}

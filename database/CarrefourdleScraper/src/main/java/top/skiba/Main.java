package top.skiba;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Scraper scraper = new Scraper();
        DatabaseUploader databaseUploader = new DatabaseUploader();

        while(true) {
            System.out.println("\nEnter command:\n    scrape [url]\n    upload [json_path]\n    exit");
            System.out.print("> ");
            String input = scanner.nextLine();
            String[] parts = input.split(" ");
            String command = parts[0];
            if (command.equalsIgnoreCase("scrape") && parts.length == 2) {
                //scrape(parts[1]);
                scraper.scrape("https://www.carrefour.pl/napoje");
            }
            else if(command.equalsIgnoreCase("upload") && parts.length == 2) {
                databaseUploader.upload(parts[1]);
            }
            else if(input.equals("exit")) {
                System.out.println("Bye bye");
                break;
            }
            else {
                System.out.println("Unknown command " + parts.length + ":" + command);
            }
        }
    }
}
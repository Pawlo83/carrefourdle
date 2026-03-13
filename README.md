# Carrefourdle

![Project Status](https://img.shields.io/badge/status-in--development-blue)
![Language](https://img.shields.io/badge/language-Java--21-blue)
![Framework](https://img.shields.io/badge/framework-Spring--Boot--4.0.3-blue)
![Database](https://img.shields.io/badge/database-Supabase-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Projekt gry przeglądarkowej typu "daily guessing game", inspirowana mechaniką popularnego w USA Costcodle. Zadaniem gracza jest odgadnięcie aktualnej ceny produktu w sieci sklepów Carrefour na podstawie zdjęcia i nazwy. System wykorzystuje rzeczywiste dane pobierane za pomocą scrapera sieciowego.

![screenshot]()

## Kluczowe funkcjonalności

## Technologie

### Backend (Silnik Gry)
* **Język:** Java 21
* **Framework:** Spring Boot 4.0.3
* **Komunikacja:** Java HttpClient

### Baza Danych
* **Silnik:** PostgreSQL (Supabase)
* **Storage:** Supabase Buckets (zdjęcia produktów).

### Frontend (Planowany)
* **Framework:** ?

## Architektura Systemu

Projekt wykorzystuje architekturę trójwarstwową:

1.  **Baza Danych (Supabase):** Przechowuje pełne rekordy produktów, w tym również niezbędne grafiki, a także odpowiada za rotację codziennym produktem.

2.  **Backend (Spring Boot):** Pośredniczy między użytkownikiem a surowymi danymi, stanowi silnik gry.

3.  **Frontend (React):** Warstwa prezentacji odpowiadająca za interakcję użytkownika bez zbędnej logiki obliczeniowej.

## Sposób instalacji i uruchomienia:

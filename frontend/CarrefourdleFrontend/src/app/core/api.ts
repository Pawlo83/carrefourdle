import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './modals';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api'; //TODO move to enviroment

    getDailyProduct(): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/product/today`);
    }

    getRandomProduct(): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/product/random`);
    }

    submitGuess(productName: String, price: number): Observable<number> {
        return this.http.post<number>(`${this.baseUrl}/product/guess`, {
            productName: productName,
            priceGuess: price
        });
    }
}
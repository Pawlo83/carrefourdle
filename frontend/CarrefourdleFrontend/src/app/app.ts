import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Product } from './core/api';

import { ItemContainerComponent } from './components/item-container/item-container.component';
import { AnswersContainerComponent } from './components/answers-container/answers-container.component';
import { InputContainerComponent } from './components/input-container/input-container.component';

interface Attempt {
    priceGuess: string | null;
    priceExact?: string | null;
    result: number | null;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ItemContainerComponent, AnswersContainerComponent, InputContainerComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    private apiService = inject(ApiService);
    
    product = signal<Product | null>(null);
    currentGuessIndex = 0;
    
    attempts: Attempt[] = Array(7).fill(null).map(() => ({
        priceGuess: null,
        result: null
    }));

    ngOnInit() {
        this.apiService.getDailyProduct().subscribe({
            next: (data) => {
                console.log('Produkt załadowany:', data);
                this.product.set(data);
            },
            error: (err) => console.error('Błąd pobierania produktu:', err)
        });
    }

    get isGameOver(): boolean {
        const hasWon = this.attempts.some(a => a.result === 0);
        const noMoreTries = this.currentGuessIndex >= 7;
        return hasWon || noMoreTries;
    }

    handleGuess(priceValue: string) {
        const productData = this.product();
        if (!productData || this.currentGuessIndex >= 7) return;

        const numericPrice = parseFloat(priceValue);
        if (isNaN(numericPrice)) return;

        this.apiService.submitGuess(productData.name, numericPrice).subscribe({
            next: (response: any) => {
                const answer = response.answer;

                this.attempts[this.currentGuessIndex] = {
                    priceGuess: numericPrice.toFixed(2),
                    priceExact: response.priceExact.toFixed(2),
                    result: answer
                };
                
                this.currentGuessIndex++;
            },
            error: (err) => console.error('Nieudane połączenie:', err)
        });
    }
}
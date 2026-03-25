import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './core/api';
import { LocalStorageService } from './core/localStorage';
import { LocalStats, Attempt, Product } from './core/modals';

import { ItemContainerComponent } from './components/item-container/item-container.component';
import { AnswersContainerComponent } from './components/answers-container/answers-container.component';
import { InputContainerComponent } from './components/input-container/input-container.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ItemContainerComponent, AnswersContainerComponent, InputContainerComponent, HeaderComponent, ModalComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    private apiService = inject(ApiService);
    private localStorage = inject(LocalStorageService);
    
    product = signal<Product | null>(null);
    stats = signal<LocalStats | null>(null);
    gameMode = signal<'DAILY' | 'RANDOM'>('DAILY');
    gameState = signal<'IN_PROGRESS' | 'WON' | 'LOST'>('IN_PROGRESS');
    isHelpOpen = signal(false);
    isStatsOpen = signal(false);
    isProductLoading = signal(true);
    currentGuessIndex = 0;
    
    attempts: Attempt[] = Array(7).fill(null).map(() => ({
        priceGuess: null,
        result: null
    }));
    mockRulesAttempts: Attempt[] = [
        { priceGuess: '50.00', priceExact: '15.99', result: 2 },
        { priceGuess: '20.00', priceExact: '15.99', result: 1 },
        { priceGuess: '15.00', priceExact: '15.99', result: -1 },
        { priceGuess: '1.00', priceExact: '15.99', result: -2 },
        { priceGuess: '16.00', priceExact: '15.99', result: 0 }
    ];

    ngOnInit() {
        this.loadGame();
    }

    loadGame() {
        this.stats.set(this.localStorage.getStats());
        this.isProductLoading.set(true);
        let savedState = null;

        if (this.gameMode() === 'DAILY') {
            savedState = this.localStorage.getDailyState();
            if (savedState) {
                this.attempts = savedState.attempts;
                this.currentGuessIndex = savedState.currentIndex;
                this.gameState.set(savedState.gameStatus);
            }
        }
        if (this.gameMode() !== 'DAILY' || (this.gameMode() === 'DAILY' && savedState === null)){
            this.currentGuessIndex = 0;
            this.gameState.set('IN_PROGRESS');
            this.attempts = Array(7).fill(null).map(() => ({ 
                priceGuess: null, 
                priceExact: null, 
                result: null 
            }));
        }

        const fetch = this.gameMode() === 'DAILY' ? this.apiService.getDailyProduct() : this.apiService.getRandomProduct();
        fetch.subscribe({
            next: (p) => {
                this.product.set(p);
                this.isProductLoading.set(false);
            },
            error: (err) => {
                this.isProductLoading.set(false);
            }
        });
    }

    switchMode(newMode: 'DAILY' | 'RANDOM') {
        if (this.gameMode() === 'DAILY' && newMode === 'DAILY') {
            return; 
        }
        this.gameMode.set(newMode);
        this.loadGame();
    }

    handleGuess(priceValue: string) {
        const productData = this.product();
        if (!productData || this.gameState() !== 'IN_PROGRESS') return;

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

                if (answer === 0) {
                    this.gameState.set('WON');
                } else if (this.currentGuessIndex >= 7) {
                    this.gameState.set('LOST');
                }

                if (this.gameMode() === 'DAILY') {
                    let currentState = this.gameState();

                    this.localStorage.saveDailyState(this.attempts, this.currentGuessIndex, currentState);
                    
                    if (currentState !== 'IN_PROGRESS') {
                        const freshStats = this.localStorage.updateStats(currentState, this.currentGuessIndex);
                        this.stats.set(freshStats);

                        setTimeout(() => {
                            this.isStatsOpen.set(true);
                        }, 1500);
                    }
                }
            },
            error: (err) => console.error('Nieudane połączenie:', err)
        });
    }
}
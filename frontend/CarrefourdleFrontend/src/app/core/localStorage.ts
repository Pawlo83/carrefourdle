import { Injectable } from '@angular/core';
import { LocalGameState, LocalStats} from './modals';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly DAILY_STATE_KEY = 'carrefourdle_daily_state';
    private readonly STATS_KEY = 'carrefourdle_stats';

    private getDateString(offsetDays: number = 0): string {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        
        const offset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() - offset);
        return localDate.toISOString().split('T')[0];
    }

    getDailyState(): LocalGameState | null {
        const data = localStorage.getItem(this.DAILY_STATE_KEY);
        if (!data) return null;

        try {
            const state: LocalGameState = JSON.parse(data);
            
            if (state.lastPlayedDate !== this.getDateString()) {
                this.clearDailyState();
                return null;
            }
            return state;
        } catch (e) {
            console.error('Failed to parse daily state from LocalStorage', e);
            this.clearDailyState();
            return null;
        }
    }

    saveDailyState(attempts: any[], currentIndex: number, gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST'): void {
        const state: LocalGameState = {
            lastPlayedDate: this.getDateString(),
            attempts,
            currentIndex,
            gameStatus
        };
        localStorage.setItem(this.DAILY_STATE_KEY, JSON.stringify(state));
    }

    clearDailyState(): void {
        localStorage.removeItem(this.DAILY_STATE_KEY);
    }


    getStats(): LocalStats {
        const data = localStorage.getItem(this.STATS_KEY);
        let stats: LocalStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            avgGuesses: 0
        };

        if (data) {
            try {
                stats = JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse stats from LocalStorage', e);
            }
        }
        
        if (stats.currentStreak > 0 && stats.lastCompletedDate) {
            if (stats.lastCompletedDate < this.getDateString(-1)) {
                stats.currentStreak = 0;
                localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
            }
        }

        return stats;
    }

    updateStats(state: string, guessesUsed: number): LocalStats {
        const stats = this.getStats();
        const today = this.getDateString();
        const yesterday = this.getDateString(-1);

        if (stats.lastCompletedDate && stats.lastCompletedDate !== yesterday && stats.lastCompletedDate !== today) {
            stats.currentStreak = 0;
        }

        stats.gamesPlayed++;

        if (state === 'WON') {
            const totalPreviousGuesses = stats.avgGuesses * stats.gamesWon;
            stats.gamesWon++;
            stats.avgGuesses = (totalPreviousGuesses + guessesUsed) / stats.gamesWon;
            stats.lastCompletedDate = today;

            stats.currentStreak++;
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
            }
        } 
        else {
            stats.currentStreak = 0;
        }

        localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
        return stats;
    }
}
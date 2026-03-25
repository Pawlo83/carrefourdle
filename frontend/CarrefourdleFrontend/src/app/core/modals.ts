export interface Product {
    name: string;
    image_url: string;
    source_url: string;
    category: string;
}

export interface Attempt {
    priceGuess: string | null;
    priceExact?: string | null;
    result: number | null;
}

export interface LocalStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    avgGuesses: number;
    lastCompletedDate?: string;
}

export interface LocalGameState {
    lastPlayedDate: string;
    attempts: Attempt[];
    currentIndex: number;
    gameStatus: 'IN_PROGRESS' | 'WON' | 'LOST';
}
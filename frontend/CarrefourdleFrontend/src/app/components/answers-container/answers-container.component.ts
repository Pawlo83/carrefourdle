import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Attempt {
    priceGuess: string | null;
    priceExact?: string | null;
    result: number | null;
}

@Component({
    selector: 'app-answers-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './answers-container.component.html',
    styleUrls: ['./answers-container.component.css']
})
export class AnswersContainerComponent {
    @Input() attempts: Attempt[] = [];
    
    protected readonly Math = Math;

    getStatusClass(result: number | null): string {
        if (result === null) return '';
        if (result < 0) return 'status-neg-' + Math.abs(result);
        return 'status-' + result;
    }
}




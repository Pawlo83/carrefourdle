import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-input-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input-container.component.html',
    styleUrls: ['./input-container.component.css']
})
export class InputContainerComponent {
    @Output() guessSubmitted = new EventEmitter<string>();
    @Input() disabled: boolean = false;

    submit(value: string) {
        if (!value || this.disabled) return;
        this.guessSubmitted.emit(value);
  }
}
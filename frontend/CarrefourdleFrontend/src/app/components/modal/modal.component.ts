import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="close.emit()">
            <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-md" (click)="$event.stopPropagation()">
                <div class="relative flex items-center justify-center mb-6">
                    <h2 class="text-2xl font-black">{{ title }}</h2>
                    <button class="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:bg-slate-100 rounded-full hover:text-slate-800 transition-colors" (click)="close.emit()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class ModalComponent {
    @Input() title: string = '';
    @Output() close = new EventEmitter<void>();
}
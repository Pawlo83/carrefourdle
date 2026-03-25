import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    @Output() modeChanged = new EventEmitter<'DAILY' | 'RANDOM'>();
    @Output() openHelp = new EventEmitter<void>();
    @Output() openStats = new EventEmitter<void>();
    @Input() currentMode: 'DAILY' | 'RANDOM' = 'DAILY';

    setMode(mode: 'DAILY' | 'RANDOM') {
        this.modeChanged.emit(mode);
    }
}
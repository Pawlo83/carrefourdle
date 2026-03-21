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
    @Output() modeChanged = new EventEmitter<'daily' | 'random'>();
    @Input() currentMode: 'daily' | 'random' = 'daily';

    setMode(mode: 'daily' | 'random') {
        this.modeChanged.emit(mode);
    }
}
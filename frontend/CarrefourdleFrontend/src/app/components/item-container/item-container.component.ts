import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/modals';

@Component({
  selector: 'app-item-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-container.component.html',
  styleUrls: ['./item-container.component.css']
})
export class ItemContainerComponent {
    @Input() product = signal<Product | null>(null);
    @Input() isProductLoading = signal(true);
}
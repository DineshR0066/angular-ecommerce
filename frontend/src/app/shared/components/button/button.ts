import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost' | 'teal' | 'light-blue'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  
  btnClick = output<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit(event);
    }
  }
}

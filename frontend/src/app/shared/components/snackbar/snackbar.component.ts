import { Component, inject } from '@angular/core';
import { SnackbarService, SnackbarMessage } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  template: `
    <div class="snackbar-host" aria-live="polite" aria-atomic="false" role="status">
      @for (msg of snackbar.messages(); track msg.id) {
        <div
          class="snackbar-item"
          [class.snackbar--success]="msg.type === 'success'"
          [class.snackbar--error]="msg.type === 'error'"
          [class.snackbar--info]="msg.type === 'info'"
          role="alert"
        >
          <span class="snackbar-icon">
            @if (msg.type === 'success') { ✓ }
            @else if (msg.type === 'error') { ✕ }
            @else { ℹ }
          </span>
          <span class="snackbar-text">{{ msg.text }}</span>
          <button
            class="snackbar-close"
            (click)="snackbar.dismiss(msg.id)"
            aria-label="Dismiss notification"
          >×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .snackbar-host {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }

    .snackbar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      animation: snackbar-in 0.25s ease;
      border: 1px solid rgba(255,255,255,0.08);
    }

    @keyframes snackbar-in {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .snackbar--success { background: #1a3a2e; border-color: rgba(144,204,211,0.3); }
    .snackbar--error   { background: #3a1a1a; border-color: rgba(231,76,60,0.3); }
    .snackbar--info    { background: #1a2530; border-color: rgba(144,204,211,0.15); }

    .snackbar-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .snackbar--success .snackbar-icon { color: #90ccd3; }
    .snackbar--error   .snackbar-icon { color: #e74c3c; }
    .snackbar--info    .snackbar-icon { color: #90ccd3; }

    .snackbar-text { flex: 1; line-height: 1.4; }

    .snackbar-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    .snackbar-close:hover { color: #fff; }
  `]
})
export class SnackbarComponent {
  readonly snackbar = inject(SnackbarService);
}

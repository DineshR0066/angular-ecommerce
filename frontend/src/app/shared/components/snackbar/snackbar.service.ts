import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarMessage {
  readonly text: string;
  readonly type: SnackbarType;
  readonly id: number;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly messages = signal<SnackbarMessage[]>([]);
  private nextId = 0;

  show(text: string, type: SnackbarType = 'info', durationMs = 4000): void {
    const id = this.nextId++;
    this.messages.update((msgs) => [...msgs, { text, type, id }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'error');
  }

  info(text: string): void {
    this.show(text, 'info');
  }

  dismiss(id: number): void {
    this.messages.update((msgs) => msgs.filter((m) => m.id !== id));
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * Local Storage Methods
   */
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return item as unknown as T;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  /**
   * Cookie Methods
   */
  setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  getCookie(name: string): string | null {
    const nameLenPlus = name.length + 1;
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
        .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null
    );
  }

  deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }
}

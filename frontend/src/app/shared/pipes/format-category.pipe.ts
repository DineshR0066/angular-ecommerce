import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCategory',
  standalone: true
})
export class FormatCategoryPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Search {
  searchQuery = signal<string>('');

  changeSearchQuery(query: string) {
    this.searchQuery.set(query);
  }
}


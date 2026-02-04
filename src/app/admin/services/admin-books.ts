import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Book } from 'src/app/interfaces/admin/book.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminBooks {

  private API = environment.apiUrl;
  private _refresh = new Subject<void>();
  refresh$ = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<Book[]>(`${this.API}/admin/book`);
  }

  getBook(id: number) {
    return this.http.get<Book>(`${this.API}/admin/book/${id}`);
  }

  createBook(data: Partial<Book>) {
    return this.http.post<Book>(`${this.API}/admin/book`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  updateBook(id: number, data: Partial<Book>) {
    return this.http.put<Book>(`${this.API}/admin/book/${id}`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  triggerRefresh(){
    this._refresh.next();
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.API}/admin/book/${id}`);
  }

}

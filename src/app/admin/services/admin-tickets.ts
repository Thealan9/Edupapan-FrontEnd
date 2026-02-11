import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminTickets {


    private API = environment.apiUrl;
    private _refresh = new Subject<void>();
    refresh$ = this._refresh.asObservable();

    constructor(private http: HttpClient) {}

    get(){
      return this.http.get<any>(`${this.API}/admin/ticketI`);
    }
    createEntry(data: Partial<any>) {
      return this.http.post<any>(`${this.API}/admin/ticket/entry`, data).pipe(
        tap( ()=> this.triggerRefresh())
      );
    }

    createSale(data: Partial<any>) {
      return this.http.post<any>(`${this.API}/admin/ticket/sale`, data).pipe(
        tap( ()=> this.triggerRefresh())
      );
    }
    createRemoved(data: Partial<any>) {
      return this.http.post<any>(`${this.API}/admin/ticket/removed`, data).pipe(
        tap( ()=> this.triggerRefresh())
      );
    }

    createChange(data: Partial<any>) {
      return this.http.post<any>(`${this.API}/admin/ticket/change`, data).pipe(
        tap( ()=> this.triggerRefresh())
      );
    }

    triggerRefresh(){
      this._refresh.next();
    }


}

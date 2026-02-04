import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminBooking {
  private API = environment.apiUrl;
  private _refresh$ = new Subject<void>();
  refresh$ = this._refresh$.asObservable();

  constructor(private http: HttpClient) {}

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/admin/bookings`);
  }

  getBooking(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/admin/bookings/${id}`);
  }

  updateStatus(id: number, data: any) {
    return this.http.patch(`${this.API}/admin/bookings/${id}/status`, data).pipe(
        tap( ()=> this.triggerRefresh())
    );
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.API}/admin/bookings/${id}`);
  }

  triggerRefresh() {
    this._refresh$.next();
  }

}

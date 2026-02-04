import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminServices {
  private API = environment.apiUrl;
  private _refresh$ = new Subject<void>();
  refresh$ = this._refresh$.asObservable();

  constructor(private http: HttpClient) {}

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/admin/services`);
  }

  getService(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/admin/services/${id}`);
  }

  createService(data: any) {
    return this.http.post(`${this.API}/admin/services`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  updateService(id: number, data: any) {
    return this.http.put(`${this.API}/admin/services/${id}`, data).pipe(
        tap( ()=> this.triggerRefresh())
    );
  }

  deleteService(id: number) {
    return this.http.delete(`${this.API}/admin/services/${id}`);
  }

  triggerRefresh() {
    this._refresh$.next();
  }
}

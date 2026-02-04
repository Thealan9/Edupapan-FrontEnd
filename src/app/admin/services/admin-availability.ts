import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { serviceAvailability } from 'src/app/interfaces/admin/serviceAvailability.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminAvailability {
  private API = environment.apiUrl;
  private _refresh$ = new Subject<void>();
  refresh$ = this._refresh$.asObservable();

  constructor(private http: HttpClient) {}

  createAvailability(serviceId: number, data: Partial<serviceAvailability>) {
    return this.http.post(`${this.API}/admin/service-availability/${serviceId}`,data);
  }

  updateAvailability(id: number, data: Partial<serviceAvailability>) {
    return this.http.put(`${this.API}/admin/service-availability/${id}`, data);
  }

  createRange(serviceId: number, data: any) {
    return this.http.post(`${this.API}/admin/service-availability/${serviceId}/range`,data);
  }

  triggerRefresh() {
    this._refresh$.next();
  }
}

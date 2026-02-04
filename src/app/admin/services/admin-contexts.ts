import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServiceContext } from 'src/app/interfaces/admin/serviceContext.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminContexts {
  private API = environment.apiUrl;
  private _refresh$ = new Subject<void>();
  refresh$ = this._refresh$.asObservable();

  constructor(private http: HttpClient) {}

  //   getContexts(serviceId: number) {
  //   return this.http.get<ServiceContext[]>(`${this.API}/admin/service-contexts/contexts/${serviceId}`);
  // }

  createContext(serviceId: number, data: Partial<ServiceContext>) {
    return this.http.post(
      `${this.API}/admin/service-contexts/${serviceId}`,data);
  }

  updateContext(id: number, data: Partial<ServiceContext>) {
    return this.http.put(`${this.API}/admin/service-contexts/${id}`, data);
  }

  triggerRefresh() {
    this._refresh$.next();
  }
}

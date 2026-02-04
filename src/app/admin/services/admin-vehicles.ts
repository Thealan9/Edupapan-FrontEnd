import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Vehicle } from 'src/app/interfaces/admin/vehicle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminVehicles {

  private API = environment.apiUrl;
  private _refresh = new Subject<void>();
  refresh$ = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  getVehicles() {
    return this.http.get<Vehicle[]>(`${this.API}/admin/vehicle`);
  }

  getVehicle(id: number) {
    return this.http.get<Vehicle>(`${this.API}/admin/vehicle/${id}`);
  }

  createVehicle(data: Partial<Vehicle>) {
    return this.http.post<Vehicle>(`${this.API}/admin/vehicle`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  updateVehicle(id: number, data: Partial<Vehicle>) {
    return this.http.put<Vehicle>(`${this.API}/admin/vehicle/${id}`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  triggerRefresh(){
    this._refresh.next();
  }

  deleteVehicle(id: number) {
    return this.http.delete(`${this.API}/admin/vehicle/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Pallet } from 'src/app/interfaces/admin/pallet.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminPallets {

  private API = environment.apiUrl;
  private _refresh = new Subject<void>();
  refresh$ = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  getPallets() {
    return this.http.get<Pallet[]>(`${this.API}/admin/pallet`);
  }

  getPallet(id: number) {
    return this.http.get<Pallet>(`${this.API}/admin/pallet/${id}`);
  }

  createPallet(data: Partial<Pallet>) {
    return this.http.post<any>(`${this.API}/admin/pallet`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  updatePallet(id: number, data: Partial<Pallet>) {
    return this.http.put<any>(`${this.API}/admin/pallet/${id}`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  triggerRefresh(){
    this._refresh.next();
  }

  deletePallet(id: number) {
    return this.http.delete<any>(`${this.API}/admin/pallet/${id}`);
  }


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Local } from 'src/app/interfaces/admin/local.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminLocal {
  private API = environment.apiUrl;
  private _refresh = new Subject<void>();
  refresh$ = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  getLocals() {
    return this.http.get<Local[]>(`${this.API}/admin/locals`);
  }

  getLocal(id: number) {
    return this.http.get<Local>(`${this.API}/admin/locals/${id}`);
  }

  createLocal(data: Partial<Local>) {
    return this.http.post<Local>(`${this.API}/admin/locals`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  updateLocal(id: number, data: Partial<Local>) {
    return this.http.put(`${this.API}/admin/locals/${id}`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  triggerRefresh(){
    this._refresh.next();
  }

  deleteLocal(id: number) {
    return this.http.delete(`${this.API}/admin/locals/${id}`);
  }

}

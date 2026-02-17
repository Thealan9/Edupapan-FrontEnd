import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Package } from 'src/app/interfaces/admin/package.model';
import { PackageResponse } from 'src/app/interfaces/admin/packageResonse.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminPackages {

  private API = environment.apiUrl;
  private _refresh = new Subject<void>();
  refresh$ = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  getPackages() {
    return this.http.get<PackageResponse[]>(`${this.API}/admin/package`);
  }

  getPackage(id: number) {
    return this.http.get<any>(`${this.API}/admin/package/${id}`)
  }

  updatePackage(id: number, data: Partial<Package>) {
    return this.http.put<Package>(`${this.API}/admin/package/${id}`, data).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  triggerRefresh(){
    this._refresh.next();
  }


}

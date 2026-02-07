import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { TicketResponse } from 'src/app/interfaces/admin/ticketResponse.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WarehouseTicket {

  private API = environment.apiUrl;
  private _refresh = new Subject<void>();
  refresh$ = this._refresh.asObservable();

  constructor(private http: HttpClient) {}

  getTickets() {
    return this.http.get<any>(`${this.API}/warehouseman/tickets`);
  }

  getTicket(id: number) {
    return this.http.get<TicketResponse>(`${this.API}/warehouseman/ticket/${id}`);
  }

  acceptTicket(id: number) {
    return this.http.patch<any>(`${this.API}/warehouseman/ticket/${id}/accept`,{});
  }

  processDetails(id: number, data : Partial<any>) {
    return this.http.patch<any>(`${this.API}/warehouseman/ticket-detail/${id}/process`, data);
  }

  completeTicketEntry(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/complete-entry`,{}).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  completeTicketSale(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/complete-sale`,{}).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  completeTicketRemoved(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/complete-removed`,{}).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  completeTicketChange(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/complete-change`,{}).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  requestPartial(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/request-partial`,{}).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  completePartial(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/complete-partial`,{}).pipe(
      tap( ()=> this.triggerRefresh())
    );
  }

  autocompleteTicket(id: number) {
    return this.http.post<any>(`${this.API}/warehouseman/ticket/${id}/autocomplete-sale`,{});
  }

  triggerRefresh(){
    this._refresh.next();
  }

}

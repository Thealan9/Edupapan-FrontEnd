import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketResponse } from 'src/app/interfaces/admin/ticketResponse.model';
import { WarehouseTicket } from '../../services/warehouse-ticket';

@Component({
  selector: 'app-change',
  templateUrl: './change.page.html',
  styleUrls: ['./change.page.scss'],
  standalone: false,
})
export class ChangePage implements OnInit {

  ticketId!: number;
  ticketInfo!: TicketResponse;
  loading = true;
  error: boolean = false;

  // status del paquete
  isDeatilPackageStatus = false;
  actionSheetButtons: any[] = [];
  addDescriptionPackageStatus = false;
  addDescriptionHeader = '';
  addDescriptionSubheader = '';
  alertInputs: any[] = [];
  actionAddDescriptionPackageStatusButtons: any[] = [];


  //alert solicitar parcial
  isAlertOpen = false;
  alertHeader = '';
  alertMessage = '';
  alertButtons: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private Service: WarehouseTicket,
    private router: Router
  ) {}

  ngOnInit() {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket();
    this.Service.refresh$.subscribe(() => {
      this.loadTicket();
    });
  }

  loadTicket() {
    this.loading = true;
    this.Service.getTicket(this.ticketId).subscribe({
      next: ticket =>{
      this.ticketInfo = ticket;
      if(this.ticketInfo.type !== 'change'){
        this.router.navigateByUrl('/warehouseman', { replaceUrl: true });
      }
      this.loading = false;

      },
      error: err =>{
        console.log("error al cargar el ticket",err)
        this.loading = false;
        this.error = !this.error;
      }
    });
  }

  confirm() {
    this.Service.completeTicketChange(this.ticketId).subscribe({
      next: () => this.router.navigateByUrl('/warehouseman', { replaceUrl: true }),
      error: (err) => {
          console.error("Error desconocido", err);
      },
    });
  }




  opendetailPackageStatus(id:number) {
    this.isDeatilPackageStatus = true;

    this.actionSheetButtons = [
    {
      text: 'completado',
      handler: () => {
        //this.sendPackageStatusDetail(id, 'completed', null);
        this.openAddDescriptionPackageStatus(id,'completed');
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ]

  }
  sendPackageStatusDetail(id: number, status: string, description: string | null) {
    const data = {
      status,
      description,
    };
    this.Service.processDetails(id, data).subscribe({
      next: () => {
        this.isDeatilPackageStatus = false;
        this.loadTicket();
      },
      error: (err) => console.error("Error al actualizar el estado del paquete", err)
    });
  }
  openAddDescriptionPackageStatus(id: number,status: string){
    this.addDescriptionPackageStatus = true;
    if(status === 'completed'){
      this.addDescriptionHeader = '¿Confirmar como completado?';
      this.addDescriptionSubheader = 'No hay cambios en el estado del paquete a partir de este punto.';
      this.alertInputs = [];
      this.actionAddDescriptionPackageStatusButtons = [
        {
          text: 'confirmar',
          handler: () => {
            this.sendPackageStatusDetail(id, status, null);
          }
        },
        {
          text: 'cancelar',
          role: 'cancel',
          handler: () => {
            this.addDescriptionPackageStatus = false;
          }
        }
      ]
    }else{
      this.addDescriptionHeader = 'Confirmar estado ' + status;
      this.addDescriptionSubheader = 'No hay cambios en el estado del paquete, ¿deseas confirmar que el paquete está ' + status + '?';
    this.alertInputs = [
    {
      name: 'description',
      type: 'textarea',
      placeholder: 'Ejemplo: El empaque llegó abierto o mojado...',
    }
  ];

    this.actionAddDescriptionPackageStatusButtons = [
      {
        text : 'confirmar',
        handler: (data: any) => {
          const description = data.description?.trim() || 'Sin descripción';
          this.sendPackageStatusDetail(id, status, description);
        }
      },
      {
        text: 'cancelar',
        role: 'cancel',
        handler: () => {
          this.addDescriptionPackageStatus = false;
        }
      }
    ]
  }
}

}

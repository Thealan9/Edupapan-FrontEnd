import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseTicket } from '../../services/warehouse-ticket';
import { TicketResponse } from 'src/app/interfaces/admin/ticketResponse.model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
  standalone: false,
})
export class EntryPage implements OnInit {

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
      if(this.ticketInfo.type !== 'entry'){
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
    this.Service.completeTicketEntry(this.ticketId).subscribe({
      next: () => this.router.navigateByUrl('/warehouseman', { replaceUrl: true }),
      error: (err) => {
          if (err.status === 409) {
          this.setupPartialAlert(err.error);
        } else {
          console.error("Error desconocido", err);
        }
      },
    });
  }
  confirmPartial() {
    this.Service.completePartial(this.ticketId).subscribe({
      next: () => this.router.navigateByUrl('/warehouseman', { replaceUrl: true }),
      error: (err) => console.error("Error al completar parcial", err)
    });
  }

  setupPartialAlert(data: any) {
    this.alertHeader = 'Ticket incompleto';
    this.alertMessage = data.message;

    this.alertButtons = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => { this.isAlertOpen = false; }
      },
      {
        text: 'Solicitar',
        handler: () => {
          this.sendPartialRequest();
        }
      }
    ];

    this.isAlertOpen = true;
  }

  sendPartialRequest() {
    this.Service.requestPartial(this.ticketId).subscribe({
      next: () => {
        this.isAlertOpen = false;
        this.router.navigateByUrl('/warehouseman', { replaceUrl: true });
      },
      error: (err) => console.error("Error al solicitar parcial", err)
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
    // {
    //   text: 'Dañado',
    //   handler: () => {
    //     this.openAddDescriptionPackageStatus(id,'damaged');
    //   }
    // },
    // {
    //   text: 'Perdido',
    //   handler: () => {
    //     this.openAddDescriptionPackageStatus(id,'missing');
    //   }
    // },
    // {
    //   text: 'otro',
    //   handler: () => {
    //     this.openAddDescriptionPackageStatus(id,'other');
    //   }
    // },
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

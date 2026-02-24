import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketResponse } from 'src/app/interfaces/admin/ticketResponse.model';
import { WarehouseTicket } from '../../services/warehouse-ticket';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';

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

  private snack = inject(MatSnackBar);
  constructor(
    private route: ActivatedRoute,
    private Service: WarehouseTicket,
    private router: Router,
    private modalCtrl: ModalController
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
      next: (res) =>{this.router.navigateByUrl('/warehouseman', { replaceUrl: true }); this.showAlert(res.message, 'success')},
      error: (err) => {
        if ( err.status === 422){
          this.showAlert(err.error.message, 'warning');
        } else {
          this.showAlert('Oops, ocurrió un error!', 'error');
        }
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
      next: (res) => {
        this.isDeatilPackageStatus = false;
        this.Service.triggerRefresh();
        this.showToast(res.message, 'success')
      },
      error: (err) => {
        if (err.status === 409 || err.status === 422) {
            this.showToast(err.error.message, 'warning');
          } else {
            this.showToast('Oops, ocurrió un error!', 'error');
          }
      }
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

async showAlert(
        message: string,
        type: 'success' | 'error' | 'warning'
      ) {
        const modal = await this.modalCtrl.create({
          component: AlertComponent,
          componentProps: { message, type },
          cssClass: 'small-alert-modal',
          backdropDismiss: false,
        });

        await modal.present();
    }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.snack.open(message, '✖', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.auth.yo().subscribe({
    //   next: (res) => {
    //     this.user = res;
    //     this.loading = false;
    //     //console.log('Usuario:', res);
    //   },
    //   error: () => {
    //     this.loading = false;
    //   }
    // });
    this.user = this.route.snapshot.data['user'];
  }


}

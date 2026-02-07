import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth-guard';
import { UserResolver } from './core/user.resolver';
import { RoleGuard } from './core/role-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
//----------------------------------User---------------------------------------
  {
  path: 'home',
  canMatch: [AuthGuard,RoleGuard],
  data: { roles: ['user'] },
  loadChildren: () => import('./user/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'detail',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['user'] },
    loadChildren: () => import('./user/detail/detail.module').then( m => m.DetailPageModule)
  },



  //------------------------ Admin------------------------------
  {
  path: 'admin',
  canMatch: [AuthGuard,RoleGuard],
  data: { roles: ['admin'] },
  loadChildren: () => import('./admin/home/home.module').then(m => m.HomePageModule)
  },

  //users
  {
    path: 'admin/users',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./admin/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'admin/users/edit/:id',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./admin/users/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'admin/users/create',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./admin/users/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'admin/vehicles',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./admin/vehicles/vehicles.module').then( m => m.VehiclesPageModule)
  },
  {
    path: 'admin/books',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./admin/books/books.module').then( m => m.BooksPageModule)
  },

  //warehouseman

  {
    path: 'warehouseman',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['warehouseman'] },
    loadChildren: () => import('./warehouseman/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'warehouseman/ticket/entry/:id',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['warehouseman'] },
    loadChildren: () => import('./warehouseman/ticket/entry/entry.module').then( m => m.EntryPageModule)
  },
  {
    path: 'warehouseman/ticket/sale/:id',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['warehouseman'] },
    loadChildren: () => import('./warehouseman/ticket/sale/sale.module').then( m => m.SalePageModule)
  },
  {
    path: 'warehouseman/ticket/change/:id',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['warehouseman'] },
    loadChildren: () => import('./warehouseman/ticket/change/change.module').then( m => m.ChangePageModule)
  },
  {
    path: 'warehouseman/ticket/removed/:id',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['warehouseman'] },
    loadChildren: () => import('./warehouseman/ticket/removed/removed.module').then( m => m.RemovedPageModule)
  },


  //driver
  {
    path: 'driver',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['driver'] },
    loadChildren: () => import('./driver/home/home.module').then( m => m.HomePageModule)
  },





  //---------------------Compartidas------------------------------------------
  {
    path: 'profile',
    canMatch: [AuthGuard,RoleGuard],
    data: { roles: ['user','admin'] },
    resolve: {
    user: UserResolver
    },
    loadChildren: () => import('./user/profile/profile.module').then( m => m.ProfilePageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

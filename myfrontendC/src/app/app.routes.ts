import {Routes} from '@angular/router';
import {Login} from './features/auth/pages/login/login';
import {Register} from './features/auth/pages/register/register';
import {Profile} from './features/profile/pages/profile/profile';
import {authGuard} from './core/guards/auth-guard';
import {ListComponent} from './features/petitions/pages/list-component/list-component';
import {Home} from './pages/home-component/home';
import {ShowComponent} from './features/petitions/pages/show-component/show-component';
import {CreateComponent} from './features/petitions/pages/create-component/create-component';
import {EditComponent} from './features/petitions/pages/edit-component/edit-component';
import {MineComponent} from './features/petitions/pages/mine-component/mine-component';
import {SignedComponent} from './features/petitions/pages/signed-component/signed-component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},

  {path: 'home', component: Home, title: 'Home - Change.org'},
  {path: 'login', component: Login, title: 'Login - Change.org'},
  {path: 'register', component: Register, title: 'Registrarse - Change.org'},

  {path: 'petitions', component: ListComponent, title: 'Peticiones - Change.org'},
  {path: 'petitions/create', component: CreateComponent, canActivate: [authGuard], title: 'Crear Petición - Change.org'},
  {path: 'petitions/edit/:id', component: EditComponent, canActivate: [authGuard], title: 'Editar Petición - Change.org'},
  {path: 'petitions/mine', component: MineComponent, canActivate: [authGuard], title: 'Mis Peticiones - Change.org'},
  {path: 'petitions/signed', component: SignedComponent, canActivate: [authGuard], title: 'Mis Firmas - Change.org'},
  {path: 'petitions/:id', component: ShowComponent, title: 'Petición - Change.org'},

  {path: 'profile', component: Profile, canActivate: [authGuard], title: 'Perfil - Change.org'},


  {path: '**', redirectTo: 'login'},
];

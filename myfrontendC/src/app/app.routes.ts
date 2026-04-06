import {Routes} from '@angular/router';
import {Login} from './features/auth/pages/login/login';
import {Register} from './features/auth/pages/register/register';
import {Profile} from './features/profile/pages/profile/profile';
import {authGuard} from './core/guards/auth-guard';
import {adminGuard} from './core/guards/admin-guard';
import {ListComponent} from './features/petitions/pages/list-component/list-component';
import {Home} from './pages/home-component/home';
import {ShowComponent} from './features/petitions/pages/show-component/show-component';
import {CreateComponent} from './features/petitions/pages/create-component/create-component';
import {EditComponent} from './features/petitions/pages/edit-component/edit-component';
import {MineComponent} from './features/petitions/pages/mine-component/mine-component';
import {SignedComponent} from './features/petitions/pages/signed-component/signed-component';
import {AdminLayout} from './features/admin/layout/admin-layout';
import {Panel} from './features/admin/pages/panel/panel';
import {AdminUsers} from './features/admin/pages/admin-users/admin-users';
import {AdminUserShow} from './features/admin/pages/admin-user-show/admin-user-show';
import {AdminUserEdit} from './features/admin/pages/admin-user-edit/admin-user-edit';
import {AdminCategories} from './features/admin/pages/admin-categories/admin-categories';
import {AdminPetitionCreate} from './features/admin/pages/admin-petition-create/admin-petition-create';
import {AdminPetitionEdit} from './features/admin/pages/admin-petition-edit/admin-petition-edit';
import {AdminPetitionShow} from './features/admin/pages/admin-petition-show/admin-petition-show';

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

  // Admin
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      {path: '', component: Panel, title: 'Admin - Peticiones'},
      {path: 'petitions/create', component: AdminPetitionCreate, title: 'Admin - Crear Petición'},
      {path: 'petitions/edit/:id', component: AdminPetitionEdit, title: 'Admin - Editar Petición'},
      {path: 'petitions/:id', component: AdminPetitionShow, title: 'Admin - Ver Petición'},
      {path: 'categories', component: AdminCategories, title: 'Admin - Categorías'},
      {path: 'users', component: AdminUsers, title: 'Admin - Usuarios'},
      {path: 'users/edit/:id', component: AdminUserEdit, title: 'Admin - Editar Usuario'},
      {path: 'users/:id', component: AdminUserShow, title: 'Admin - Ver Usuario'},
    ]
  },

  {path: '**', redirectTo: 'login'},
];
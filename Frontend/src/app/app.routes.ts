import { Routes } from '@angular/router';
import { Login } from './modules/user/login/login';
import { Register } from './modules/user/register/register';
import { Home } from './modules/user/home/home';
import { ProfileComponent } from './modules/user/profile-component/profile-component';
import { AdminLogin } from './modules/admin/login/login';
import { Dashboard } from './modules/admin/dashboard/dashboard';
import { CreateUser } from './modules/admin/create-user/create-user';
import { UpdateUser } from './modules/admin/update-user/update-user';
import { adminAuthGuard } from './guards/adminAuth.guard';
import { noAdminGuard } from './guards/no-admin.guard';

export const routes: Routes = [
    {
        path : '',
        component : Login,
        pathMatch : 'full'
    },
    {
        path : 'login',
        component : Login
    },
    {
        path : 'register',
        component : Register
    },
    {
        path : 'home',
        component : Home,
        // canActivate : [authGuard]
    },
    {
        path : 'profile',
        component : ProfileComponent
    },
    {
        path : 'adminlogin',
        component : AdminLogin,
        canActivate: [noAdminGuard]
    },
    {
        path : 'dashboard',
        component : Dashboard,
        canActivate: [adminAuthGuard]
    },
    {
        path : 'create',
        component : CreateUser,
        canActivate: [adminAuthGuard]
    },
    {
        path : 'update/:id',
        component : UpdateUser,
        canActivate: [adminAuthGuard]
    }
];

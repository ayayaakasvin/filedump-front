import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { FilesComponent } from './files/files.component';
import { FilePageComponent } from './file-page/file-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Log-in',
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
    },
    {
        path: "files",
        canActivate: [AuthGuardService], // protected by cookie token check
        children: [
            {
                path: "",
                component: FilesComponent,
                title: "Files"
            },
            {
                path: "upload",
                component: UploadComponent,
                title: "Upload file"
            },
            {
                path: ":file_id",
                component: FilePageComponent,
                title: "File"
            }
        ]  
    },
    {
        path: "about",
        component: AboutComponent,
        title: "About"
    },
    {
        path: "**",
        redirectTo: "/login"
    }
];

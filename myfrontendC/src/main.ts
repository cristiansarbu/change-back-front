import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthInterceptor} from './app/core/interceptors/auth-interceptor';
import {appConfig} from './app/app.config';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

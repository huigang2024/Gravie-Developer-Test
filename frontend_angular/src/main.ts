  import { enableProdMode, importProvidersFrom } from '@angular/core';
  import { bootstrapApplication } from '@angular/platform-browser';
  import { AppComponent } from './app/app.component';
  import { environment } from './environments/environment';
  import { provideRouter } from '@angular/router';
  import { routes } from './app/app-routing.module';
  import { provideHttpClient } from '@angular/common/http';
  import { FormsModule } from '@angular/forms';
  import { RouterModule } from '@angular/router';
  import { CommonModule } from '@angular/common';

  if (environment.production) {
    enableProdMode();
  }
  
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      importProvidersFrom(FormsModule),
      importProvidersFrom(RouterModule),      
      importProvidersFrom(CommonModule),      
    ],
  }).catch(err => console.error(err));  
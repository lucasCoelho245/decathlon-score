import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { importProvidersFrom, Provider } from '@angular/core';
import { ScoresComponent } from './app/pages/scores/scores.component';
import { AboutComponent } from './app/pages/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(
      [
        { path: '', redirectTo: 'scores', pathMatch: 'full' },
        { path: 'scores', component: ScoresComponent },
        { path: 'about', component: AboutComponent }
      ],
      withComponentInputBinding()
    ),
    { provide: LocationStrategy, useClass: HashLocationStrategy } // 🔥 SOLUÇÃO CORRETA
  ]
}).catch(err => console.error(err));

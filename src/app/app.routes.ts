import { Routes } from '@angular/router';
import { DataPageComponent } from './pages/data-page/data-page.component';
import { AnalysisPageComponent } from './pages/analysis-page/analysis-page.component';
import { MonitorPageComponent } from './pages/monitor-page/monitor-page.component';

export const routes: Routes = [
  { path: 'data', component: DataPageComponent },
  { path: 'analysis', component: AnalysisPageComponent },
  { path: 'monitor', component: MonitorPageComponent },
  { path: '', redirectTo: 'data', pathMatch: 'full' },
  { path: '**', redirectTo: 'data' }
];

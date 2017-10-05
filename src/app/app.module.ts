import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppnavComponent } from './appnav/appnav.component';
import { RunLogComponent } from './run-log/run-log.component';
import { RunCompareComponent } from './run-compare/run-compare.component';
import { GoalsComponent } from './goals/goals.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterializeModule } from "angular2-materialize";
import { RunlogmasterComponent } from './runlogmaster/runlogmaster.component';
import { RunloginputComponent } from './runloginput/runloginput.component';
import { RunLogItemComponent } from './run-log-item/run-log-item.component';
import { NedbService } from './nedb.service';
import { StorageService } from './storage.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AppnavComponent,
    RunLogComponent,
    RunCompareComponent,
    GoalsComponent,
    ProgressComponent,
    DashboardComponent,
    RunlogmasterComponent,
    RunloginputComponent,
    RunLogItemComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'RunLog',
        component: RunlogmasterComponent
      },
      {
        path: 'RunCompare',
        component: RunCompareComponent
      },
      {
        path: 'Goals',
        component: GoalsComponent
      },
      {
        path: 'Progress',
        component: ProgressComponent
      },
      {
        path: 'Dashboard',
        component: DashboardComponent
      }
    ])
  ],
  providers: [StorageService, NedbService],
  bootstrap: [AppComponent]
})
export class AppModule { }

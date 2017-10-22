import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppnavComponent } from './appnav/appnav.component';
import { RunLogComponent } from './run-log/run-log.component';
import { RunCompareComponent } from './run-compare/run-compare.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterializeModule } from "angular2-materialize";
import { RunlogmasterComponent } from './runlogmaster/runlogmaster.component';
import { RunloginputComponent } from './runloginput/runloginput.component';
import { NedbService } from './nedb.service';
import { StorageService } from './storage.service';
import { CalculationsService } from './calculations.service';
import { FormsModule } from '@angular/forms';
import { FloorPipe } from 'angular-pipes/src/math/floor.pipe';
import { OrderByPipe } from 'angular-pipes/src/array/order-by.pipe';
import { CustomOrderBy } from './pipes';
import { TagsComponent } from './tags/tags.component';
import { GoalsMasterComponent } from './goals-master/goals-master.component';
import { GoalsInputComponent } from './goals-input/goals-input.component';
import { GoalsListComponent } from './goals-list/goals-list.component';
import { VO2MaxComponent } from './graphs/vo2-max/vo2-max.component';

@NgModule({
  declarations: [
    AppComponent,
    AppnavComponent,
    RunLogComponent,
    RunCompareComponent,
    ProgressComponent,
    DashboardComponent,
    RunlogmasterComponent,
    RunloginputComponent,
    FloorPipe,
    OrderByPipe,
    CustomOrderBy,
    TagsComponent,
    GoalsMasterComponent,
    GoalsInputComponent,
    GoalsListComponent,
    VO2MaxComponent
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
        path: 'Progress',
        component: VO2MaxComponent
      },
      {
        path: 'Goals',
        component: GoalsMasterComponent
      },
      {
        path: 'Dashboard',
        component: DashboardComponent
      }
    ])
  ],
  providers: [StorageService, NedbService, CalculationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

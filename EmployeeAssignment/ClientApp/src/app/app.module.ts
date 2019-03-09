import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeService } from './employee.service';
import { ReactiveFormsModule } from '@angular/forms';
import {  MatTabsModule} from '@angular/material';    
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeDeleteComponent } from './employee-delete/employee-delete.component';
import { EmployeeUpdateComponent } from './employee-update/employee-update.component';
import { EmployeeReadComponent } from './employee-read/employee-read.component';
import { MatRadioModule } from '@angular/material/radio'; 

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    EmployeeDeleteComponent,
    EmployeeUpdateComponent,
    EmployeeReadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatRadioModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [HttpClientModule, EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }

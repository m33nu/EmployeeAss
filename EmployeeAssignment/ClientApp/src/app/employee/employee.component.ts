import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  employeeIdUpdate = null;
  message = null;

  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService) {}


  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Gender: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required , Validators.pattern("[0-9]+")]],
    });
  }
  
  onFormSubmit() {
    this.dataSaved = false;
    if (this.employeeForm.invalid) {
      return;
    }

    this.dataSaved = false;
    const employee = this.employeeForm.value;
    this.CreateEmployee(employee);
  }

  CreateEmployee(employee: Employee)
  {
    console.log('Function CreateEmployee');
    this.employeeService.createEmployee(employee).subscribe(result => {
      this.dataSaved = true;
      this.message = 'Employee Record created successfully with ID: ' + result.id;
      console.log(this.message);
      this.employeeIdUpdate = null;
      this.employeeForm.reset();
    }, error => {
      this.message = 'Error while creating Employee Record. Check Logs for more details';
      console.error("CreateEmployee: " + this.message + "\n" + error.message);
      this.dataSaved = true;
      this.employeeForm.reset();
    });
  }

  OnReset() {
    this.employeeForm.reset();
    this.dataSaved = false;
  }
}  


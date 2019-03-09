import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-read',
  templateUrl: './employee-read.component.html',
  styleUrls: ['./employee-read.component.css']
})
export class EmployeeReadComponent implements OnInit {
  dataread = true;
  message = null;
  employeeForm: any;
  employeeId = null;

  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService) { }


  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      id: ['', [Validators.required]],
      FirstName: [''],
      LastName: [''],
      Email: [''],
      Gender: [''],
      PhoneNumber: [''],
    });
  }

  onSearchChange() {
    if (this.dataread) {
      this.dataread = false;
      this.employeeForm.controls['FirstName'].setValue("");
      this.employeeForm.controls['LastName'].setValue("");
      this.employeeForm.controls['Email'].setValue("");
      this.employeeForm.controls['Gender'].setValue("");
      this.employeeForm.controls['PhoneNumber'].setValue("");
    }

  }

  onFormSubmit() {
    this.dataread = true;
    this.message = null;
    const employee = this.employeeForm.value;
    this.loadEmployeeToEdit(employee.id);
  }
  loadEmployeeToEdit(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      if (employee.id == 0)
      {
        this.dataread = false;
        this.message = "Employee ID: " + employeeId + " does not exist!";
      }
        this.employeeId = employee.id;
        this.employeeForm.controls['FirstName'].setValue(employee.firstName);
        this.employeeForm.controls['LastName'].setValue(employee.lastName);
        this.employeeForm.controls['Email'].setValue(employee.email);
        this.employeeForm.controls['Gender'].setValue(employee.gender);
        this.employeeForm.controls['PhoneNumber'].setValue(employee.phoneNumber);
        
    }, error => {
      this.dataread = false;
      this.message = 'Error while reading Employee Record. Check Logs for more details';
      console.error("ReadEmployee: " + this.message + error);
      this.employeeForm.reset();
    });
  }
  resetForm() {
    this.employeeForm.reset();
    this.dataread = true;
    this.message = null;
  }
}



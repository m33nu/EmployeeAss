import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css']
})
export class EmployeeUpdateComponent implements OnInit {
  dataupdated = false;
  dataempty = false;
  dataread = false;
  message = null;
  employeeForm: any;
  employeeId = null;

  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService)
  {
  }

  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      id: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Gender: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required, Validators.pattern("[0-9]+")]],
    });
    this.dataempty = false;
  }

  onSearchChange()
  {
    if (this.dataread)

    {
      this.dataread = false;
      this.employeeForm.controls['FirstName'].setValue("");
      this.employeeForm.controls['LastName'].setValue("");
      this.employeeForm.controls['Email'].setValue("");
      this.employeeForm.controls['Gender'].setValue("");
      this.employeeForm.controls['PhoneNumber'].setValue("");
    }

  }

  OnReadButtonClick() {
    this.dataupdated = false;
    this.message = null;
    this.dataempty = false;
    this.dataread = false;
    const employee = this.employeeForm.value;
    this.loadEmployeeToEdit(employee.id);    
  }

  onUpdateFormSubmit() {
    if (this.employeeForm.invalid)
    {
      return;
    }
    this.message = null;
    this.dataupdated = false;
    this.dataempty = false;
    this.dataread = false;
    const employee = this.employeeForm.value;
    this.UpdateEmployee(employee);
  }

  loadEmployeeToEdit(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      if (employee.id == 0) {
        this.dataempty = true;
        this.message = "Employee ID: " + employeeId + " does not exist!";
      }
      else
        this.dataread = true;

      this.employeeId = employee.id;
      this.employeeForm.controls['FirstName'].setValue(employee.firstName);
      this.employeeForm.controls['LastName'].setValue(employee.lastName);
      this.employeeForm.controls['Email'].setValue(employee.email);
      this.employeeForm.controls['Gender'].setValue(employee.gender);
      this.employeeForm.controls['PhoneNumber'].setValue(employee.phoneNumber);

    }, error => {
      this.dataempty = true;
      this.message = 'Error while reading Employee Record. Check Logs for more details';
      console.error("LoadEmployee: " + this.message + error);
      this.employeeForm.reset();
    });
  }


  UpdateEmployee(employee: Employee)
  {
    this.employeeId =  employee.id;
    this.employeeService.updateEmployee(employee.id, employee).subscribe(employee => {
      if (employee.id == 0)
      {
        this.dataupdated = true;
        this.message = "Employee ID: " + this.employeeId + " does not exist!";
      }
      else
      {
        this.dataupdated = true;
        this.message = "Employee Record(Employee Id:" + employee.id + ") updated successfully.";
        this.employeeId = null;
      }
      this.employeeForm.reset();
    }, error => {
      this.message = 'Error while updating Employee Record. Check Logs for more details';
      console.error("UpdateEmployee: " + this.message + error);
      this.dataupdated = true;
      this.employeeForm.reset();
    });
  }

  resetForm() {
    this.employeeForm.reset();
    this.dataread = false;
    this.dataempty = false;
    this.dataupdated = false;
  }

}

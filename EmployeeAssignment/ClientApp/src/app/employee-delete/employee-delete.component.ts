import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-delete',
  templateUrl: './employee-delete.component.html',
  styleUrls: ['./employee-delete.component.css']
})
export class EmployeeDeleteComponent implements OnInit {
  datadeleted = false;
  dataread = false;
  dataempty = false;
  message = null;
  employeeForm: any;
  employeeId = 0;

  constructor(private formbulider: FormBuilder, private employeeService: EmployeeService)
  {}


  ngOnInit() {
    this.employeeForm = this.formbulider.group({
      id: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
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

  OnReadButtonClick() {
    this.message = null;
    this.dataread = false;
    this.dataempty = false;
    this.datadeleted = false;
    const employee = this.employeeForm.value;
    this.loadEmployeeToEdit(employee.id);
  }

  onDeleteFormSubmit() {
    this.message = null;
    this.datadeleted = false;
    this.dataread = false;
    this.dataempty = false;
    const employee = this.employeeForm.value;
    this.deleteEmployee(employee.id);
  }

  loadEmployeeToEdit(employeeId: number)
  {
    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {

      if (employee.id == 0)
      {
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

  deleteEmployee(employeeId: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.employeeService.deleteEmployeeById(employeeId).subscribe(id => {
        if (id == 0) {
          this.datadeleted = true;
          this.message = "Employee ID: " + employeeId + " does not exist!";
        }
        else {
          this.datadeleted = true;
          this.message = "Employee Record(Employee Id:" + id + ") deleted successfully.";
        }
        this.employeeId = null;
        this.employeeForm.reset();


      }, error => {
        this.message = 'Error while updating Employee Record. Check Logs for more details';
        console.error("DeleteEmployee: " + this.message + error);
        this.datadeleted = true;
        this.employeeForm.reset();
      });
    }
    else
      this.dataread = true;
  }
  resetForm() {
    this.employeeForm.reset();
    this.dataread = false;
    this.datadeleted = false;
    this.dataread = false;
    this.message = null;

  }
}


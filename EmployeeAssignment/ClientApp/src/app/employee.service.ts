import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';
import { map, catchError } from 'rxjs/operators';

@Injectable()

export class EmployeeService {
  url = '/api/Employee/';

  constructor(private http: HttpClient) { }

  
  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return Observable.throw(error);
  }

  getEmployeeById(employeeId: number)
  {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.get<Employee>(this.url + employeeId, httpOptions)
                      .pipe
                      (
                        catchError(err => this.errorHandler(err))
                      );
  }

  createEmployee(employee: Employee)
  {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.post<Employee>(this.url, employee, httpOptions)
                      .pipe
                      (
                      catchError(err => this.errorHandler(err))
                      );
  }

  updateEmployee(employeeid: number, employee: Employee): Observable<Employee>
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Employee>(this.url + employeeid, employee, httpOptions)
                    .pipe
                    (
                      catchError(err => this.errorHandler(err))
                    );
  }

  deleteEmployeeById(employeeId: number): Observable<number>
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + employeeId, httpOptions)
                    .pipe
                    (
                      catchError(err => this.errorHandler(err))
                    );
  }
}

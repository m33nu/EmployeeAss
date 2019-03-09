using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Data;

namespace EmployeeAssignment.Models
{
    public class EmployeeDbOperations
    {
        static string connectionstring;
        string createDatabaseCommand = "Create DATABASE Employee";
        string createTableCommand = "If not exists (select name from sysobjects where name = 'EmployeeTable') CREATE TABLE EmployeeTable(EmployeeId int IDENTITY(1,1) NOT NULL, FirstName varchar(50) NOT NULL, LastName varchar(50) NOT NULL, Email varchar(30) NOT NULL, Phone numeric NOT NULL, Gender varchar(6) NOT NULL )";
        string insertCommand = "Insert into dbo.EmployeeTable (FirstName, LastName, Email, Phone, Gender) Values(@FirstName, @LastName, @Email, @Phone, @Gender)";
        string updateCommand = "Update dbo.EmployeeTable set FirstName = @FirstName, LastName = @LastName, Email = @Email, Phone = @Phone, Gender = @Gender where EmployeeId = @EmployeeId";
        string deleteCommand = "Delete from dbo.Employeetable where EmployeeId=@EmployeeId";
        string readCommand = "Select * from dbo.Employeetable where EmployeeId=@EmployeeId";
        string lastInsertedCommand = "select max(EmployeeId) from dbo.Employeetable";
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(EmployeeDbOperations));

        public void SetConnectionString(string connection)
        {
            connectionstring = connection;
        }
        
        public void CreateDatabase()
        {
            try
            {
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(createDatabaseCommand, con);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                logger.Info("Database created Successfully.");
                CreateDatabasetable();

            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("already exists. Choose a different database name."))
                { 
                    logger.Info("Database already exists. Database creation Skipped");
                    connectionstring = connectionstring + ";Database = Employee";
                }
                else
                {
                    logger.Error("Unable to create Database: " + ex.Message);
                }
            }
        }

        public void CreateDatabasetable()
        {
            try
            {
                connectionstring = connectionstring + ";Database = Employee";
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(createTableCommand, con);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                logger.Info("Database initialization Completed.");
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
        }

        public Employee AddEmployee(Employee employee)
        {
            try
            {
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(insertCommand,con);
                cmd.Parameters.AddWithValue("@FirstName", employee.FirstName);
                cmd.Parameters.AddWithValue("@LastName",employee.LastName);
                cmd.Parameters.AddWithValue("@Email",employee.Email);
                cmd.Parameters.AddWithValue("@Phone",employee.PhoneNumber);
                cmd.Parameters.AddWithValue("@Gender", employee.Gender);
                con.Open();
                int rowsUpdated = cmd.ExecuteNonQuery();
                con.Close();
                if (rowsUpdated == 0)
                {
                    logger.Info("Record not added to database");
                    employee.ID = 0;
                    employee.FirstName = employee.LastName = employee.PhoneNumber = employee.Gender = employee.Email = string.Empty;
                }
                else
                {
                    employee.ID = GetLastInsertedEmployeeId();
                    logger.Info("Employee Record Added successfully with Employee Id: " + employee.ID);
                    logger.Info(employee.FirstName);
                    logger.Info(employee.LastName);
                    logger.Info(employee.Email);
                    logger.Info(employee.PhoneNumber);
                    logger.Info(employee.Gender);
                }
                return employee;
            }
            catch(Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
        }

        public int GetLastInsertedEmployeeId()
        {
            try
            {
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(lastInsertedCommand, con);
                con.Open();
                int lastupdated = (int)cmd.ExecuteScalar();
                con.Close();
                return lastupdated;
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                return 0;
            }
        }

        //Update employee record in db
        public Employee UpdateEmployee(Employee employee)
        {
            try
            {
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(updateCommand, con);
                cmd.Parameters.AddWithValue("@EmployeeId", employee.ID);
                cmd.Parameters.AddWithValue("@FirstName", employee.FirstName);
                cmd.Parameters.AddWithValue("@LastName", employee.LastName);
                cmd.Parameters.AddWithValue("@Email", employee.Email);
                cmd.Parameters.AddWithValue("@Phone", employee.PhoneNumber);
                cmd.Parameters.AddWithValue("@Gender", employee.Gender);
                con.Open();
                int rowsUpdated = cmd.ExecuteNonQuery();
                con.Close();
                if (rowsUpdated == 0)
                {
                    logger.Info("No record exist with ID = " + employee.ID);
                    employee.ID = 0;
                    employee.FirstName = employee.LastName = employee.PhoneNumber = employee.Gender = employee.Email = string.Empty;
                }
                else
                {
                    logger.Info("Employee Record updated successfully. ID = " + employee.ID + "\n Details : ");
                    logger.Info(employee.FirstName);
                    logger.Info(employee.LastName);
                    logger.Info(employee.Email);
                    logger.Info(employee.PhoneNumber);
                    logger.Info(employee.Gender);
                }
                return employee;
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
        }
        

        //Get the details of a particular employee
        public Employee GetEmployeeDetails(int id)
        {
            try
            {
                Employee employee = new Employee();
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(readCommand, con);
                cmd.Parameters.AddWithValue("@EmployeeId", id);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    employee.ID = Convert.ToInt32(rdr["EmployeeId"]);
                    employee.FirstName = rdr["FirstName"].ToString();
                    employee.LastName = rdr["LastName"].ToString();
                    employee.Email = rdr["Email"].ToString();
                    employee.PhoneNumber = rdr["Phone"].ToString();
                    employee.Gender = rdr["Gender"].ToString();
                }
                if (employee.ID == 0)
                    logger.Info("Employee Record does not exist in database with ID = " + id);
                else
                {
                    logger.Info("Employee Record read successfully. ID = " + id + "\n Details : ");
                    logger.Info(employee.FirstName);
                    logger.Info(employee.LastName);
                    logger.Info(employee.Email);
                    logger.Info(employee.PhoneNumber);
                    logger.Info(employee.Gender);
                }
               return employee;
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
        }
        //To Delete the record on a particular employee
        public int DeleteEmployee(int id)
        {
            try
            {
                SqlConnection con = new SqlConnection(connectionstring);
                SqlCommand cmd = new SqlCommand(deleteCommand, con);
                cmd.Parameters.AddWithValue("@EmployeeId", id);
                con.Open();
                int rowsUpdated = cmd.ExecuteNonQuery();
                con.Close();
                if (rowsUpdated == 0)
                {
                    logger.Info("No record exist with ID = " + id);
                    id = 0;
                }
                else
                    logger.Info("Employee Record deleted successfully. ID = " + id);
                return id;
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
        }


    }
}

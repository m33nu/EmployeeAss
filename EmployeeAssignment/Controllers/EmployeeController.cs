using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EmployeeAssignment.Models;
using Microsoft.AspNetCore.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EmployeeAssignment.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    public class EmployeeController : Controller
    {
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(EmployeeController));
        EmployeeDbOperations objemployee = new EmployeeDbOperations();
        
        [HttpGet("{id}")]
//        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public IActionResult getEmployeeById(int id)
        {
            Employee objemp = new Employee();
            int ID = Convert.ToInt32(id);
            try
            {
                objemp = objemployee.GetEmployeeDetails(ID);
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            };
            return Ok(objemp);
        }

        // POST api/<controller>
        [HttpPost]
  //      [EnableCors(origins: "*", headers: "*", methods: "*")]
        public Employee Create([FromBody] Employee employee)
        {

            if (!ModelState.IsValid)
            {
                Console.WriteLine("Error: Model state invalid");
                return employee;
            }
            try
            {
                objemployee.AddEmployee(employee);
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
            return employee;
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
    //    [EnableCors(origins: "*", headers: "*", methods: "*")]
        public Employee Put(int id, [FromBody]Employee employee)
        {
            try
            {
                Employee result = objemployee.UpdateEmployee(employee);
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }

            return employee;
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
     //   [EnableCors(origins: "*", headers: "*", methods: "*")]
        public int Delete(int id)
        {
            try
            {
                return objemployee.DeleteEmployee(id);
            }
            catch(Exception ex)
            {
                logger.Error(ex.ToString());
                throw;
            }
        }
    }
}

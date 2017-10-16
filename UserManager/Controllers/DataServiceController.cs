using UserManager.Model;
using UserManager.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace UserManager.Controllers
{
    public class DataServiceController : ApiController
    {
        UserRepository _Repository;

        public DataServiceController()
        {
            _Repository = new UserRepository();
        }

        [HttpGet]
        [Queryable]
        public HttpResponseMessage Users()
        {
            var users = _Repository.GetUsers();
            var totalRecords = users.Count();
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return Request.CreateResponse(HttpStatusCode.OK, users);
        }

        [HttpGet]
        public HttpResponseMessage States()
        {
            var states = _Repository.GetStates();
            return Request.CreateResponse(HttpStatusCode.OK, states);
        }

        [HttpGet]
        [Queryable]
        public HttpResponseMessage UsersSummary()
        {
            int totalRecords;
            var custSummary = _Repository.GetUsersSummary(out totalRecords);
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return Request.CreateResponse(HttpStatusCode.OK, custSummary);
        }

        [HttpGet]
        public HttpResponseMessage CheckUnique(int id, string property, string value)
        {
            var opStatus = _Repository.CheckUnique(id, property, value);
            return Request.CreateResponse(HttpStatusCode.OK, opStatus);
        }

        [HttpPost]
        public HttpResponseMessage Login([FromBody]UserLogin userLogin)
        {
            //Simulated login
            return Request.CreateResponse(HttpStatusCode.OK, new { status = true});
        }

        [HttpPost]
        public HttpResponseMessage Logout()
        {
            //Simulated logout
            return Request.CreateResponse(HttpStatusCode.OK, new { status = true });
        }

        // GET api/<controller>/5
        [HttpGet]
        public HttpResponseMessage UserById(int id)
        {
            var user = _Repository.GetUserById(id);
            return Request.CreateResponse(HttpStatusCode.OK, user);
        }

        // POST api/<controller>
        public HttpResponseMessage PostUser([FromBody]User user)
        {
            var opStatus = _Repository.InsertUser(user);
            if (opStatus.Status)
            {
                var response = Request.CreateResponse<User>(HttpStatusCode.Created, user);
                string uri = Url.Link("DefaultApi", new { id = user.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
        }

        // PUT api/<controller>/5
        public HttpResponseMessage PutUser(int id, [FromBody]User user)
        {
            var opStatus = _Repository.UpdateUser(user);
            if (opStatus.Status)
            {
                return Request.CreateResponse<User>(HttpStatusCode.Accepted, user);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotModified, opStatus.ExceptionMessage);
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage DeleteUser(int id)
        {
            var opStatus = _Repository.DeleteUser(id);

            if (opStatus.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
            }
        }
    }
}
using UserManager.Model;
using UserManager.Repository;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi2;
using Breeze.ContextProvider.EF6;
using Breeze.ContextProvider;

namespace UserManager.Controllers
{
    [BreezeController]
    public class BreezeDataServiceController : ApiController
    {
        readonly EFContextProvider<UserManagerContext> _contextProvider =
            new EFContextProvider<UserManagerContext>();

        public BreezeDataServiceController()
        {
            //System.Threading.Thread.Sleep(5000); 
        }

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<User> Users()
        {
            return _contextProvider.Context.Users.OrderBy(c => c.LastName);
        }

        [HttpGet]
        public List<State> States()
        {
            return _contextProvider.Context.States.OrderBy(s => s.Name).ToList();
        }

        [HttpGet]
        public IQueryable<UserSummary> UsersSummary()
        {
            var query = _contextProvider.Context.Users.Include("States").OrderBy(c => c.LastName);
            return query.Select(c =>
                new UserSummary
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    City = c.City,
                    State = c.State,
                    OrderCount = c.Orders.Count(),
                    Gender = c.Gender
                });
        }

        [HttpGet]
        public OperationStatus CheckUnique(int id, string property, string value)
        {
            switch (property.ToLower())
            {
                case "email":
                    var unique = !_contextProvider.Context.Users.Any(c => c.Id != id && c.Email == value);
                    return new OperationStatus { Status = unique };
                default:
                    return new OperationStatus();
            }

        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            try
            {
                return _contextProvider.SaveChanges(saveBundle);
            }
            catch (Exception exp)
            {
                throw;
            }

        }

    }
}
using UserManager.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserManager.Repository
{
    public class UserRepository
    {
        UserManagerContext _Context;

        public UserRepository()
        {
            _Context = new UserManagerContext();
            //System.Threading.Thread.Sleep(5000); 
        }

        public IQueryable<User> GetUsers()
        {
            var query = _Context.Users
                        .Include("Orders")
                        .Include("State")
                        .OrderBy(c => c.LastName);
            return query.AsQueryable();
        }

        public List<State> GetStates()
        {
            return _Context.States.OrderBy(s => s.Name).ToList();
        }

        public IQueryable<UserSummary> GetUsersSummary(out int totalRecords)
        {
            var query = _Context.Users
               .Include("States")
               .OrderBy(c => c.LastName);

            totalRecords = query.Count();

            return query.Select(c => new UserSummary
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                City = c.City,
                State = c.State,
                OrderCount = c.Orders.Count(),
                Gender = c.Gender
            }).AsQueryable();
        }

        public OperationStatus CheckUnique(int id, string property, string value)
        {
            switch (property.ToLower())
            {
                case "email":
                    var unique = !_Context.Users.Any(c => c.Id != id && c.Email == value);
                    return new OperationStatus { Status = unique };
                default:
                    return new OperationStatus();
            }
        }

        public User GetUserById(int id)
        {
            return _Context.Users
                    .Include("Orders")
                    .Include("State")
                    .SingleOrDefault(c => c.Id == id);
        }

        public OperationStatus InsertUser(User user)
        {
            var opStatus = new OperationStatus { Status = true };
            try
            {
                _Context.Users.Add(user);
                _Context.SaveChanges();
            }
            catch (Exception exp)
            {
                opStatus.Status = false;
                opStatus.ExceptionMessage = exp.Message;
            }
            return opStatus;
        }

        public OperationStatus UpdateUser(User user) 
        {
            var opStatus = new OperationStatus { Status = true };
            try
            {
                user.State.Id = user.StateId;
                _Context.Users.Attach(user);
                _Context.Entry<User>(user).State = System.Data.Entity.EntityState.Modified;
                _Context.SaveChanges();
            }
            catch (Exception exp)
            {
                opStatus.Status = false;
                opStatus.ExceptionMessage = exp.Message;
            }
            return opStatus;
        }

        public OperationStatus DeleteUser(int id)
        {
            var opStatus = new OperationStatus { Status = true };
            try
            {
                var cust = _Context.Users.SingleOrDefault(c => c.Id == id);
                if (cust != null)
                {
                    _Context.Users.Remove(cust);
                    _Context.SaveChanges();
                }
                else
                {
                    opStatus.Status = false;
                    opStatus.ExceptionMessage = "User not found";
                }
            }
            catch (Exception exp)
            {
                opStatus.Status = false;
                opStatus.ExceptionMessage = exp.Message;
            }
            return opStatus;
        }
    }
}
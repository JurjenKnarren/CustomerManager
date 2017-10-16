using UserManager.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace UserManager.Repository
{
    public class UserManagerContext : DbContext
    {
        public UserManagerContext()
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        // DEVELOPMENT ONLY: initialize the database
        static UserManagerContext()
        {
            Database.SetInitializer(new UserManagerDatabaseInitializer());
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<State> States { get; set; }
    }
}
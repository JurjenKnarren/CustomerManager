using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace UserManager.Repository
{
    ////DropCreateDatabaseIfModelChanges<TodosContext>
    public class UserManagerDatabaseInitializer : DropCreateDatabaseAlways<UserManagerContext> // re-creates every time the server starts
    {
        protected override void Seed(UserManagerContext context)
        {
            DataInitializer.Initialize(context);
            base.Seed(context);
        }
    }
}

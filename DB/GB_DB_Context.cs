using dbMyPlace;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace db
{
    public class GB_DB_Context: IdentityDbContext<AppUser>
    {
        public GB_DB_Context()
        : base("Data Source=.;Initial Catalog=GB;Integrated Security=true;Column Encryption Setting = Enabled")

        {
            //DbInterception.Add(new MyInterceptor());
           // DbInterception.Add(new UtcInterceptor());
        }
     

        public GB_DB_Context(string connectionString, TimeSpan defaultCommandTimeout)
           : base(connectionString)
        {
            (this as IObjectContextAdapter).ObjectContext.CommandTimeout = (int)defaultCommandTimeout.TotalSeconds;
            //(this as IObjectContextAdapter).ObjectContext.ObjectMaterialized += 
            //    (sender, e) => DateTimeKindAttribute.Apply(e.Entity, DateTimeKind.Utc);
        }
        public DbSet<Document> Documents { get; set; }


    }

}

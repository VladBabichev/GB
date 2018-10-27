using Autofac;
using Autofac.Integration.WebApi;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Newtonsoft.Json.Serialization;
using Owin;
using System;
using System.ComponentModel;
using System.Configuration;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;

[assembly: OwinStartupAttribute(typeof(MyPlace.Startup))]
namespace MyPlace
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           

           // ConfigureAuth(app);
            try
            {

                var container = GetDependencyContainer(app);
                var config = new HttpConfiguration
                {
                    DependencyResolver = new AutofacWebApiDependencyResolver(container)
                };
                Configure(config);

                //app.UseCookieAuthentication(
                //    new CookieAuthenticationOptions
                //    {
                //        AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                //        Provider = new CookieAuthenticationProvider()
                //    });




                //MigrateDatabase();



            }
            catch (Exception ex)
            {
              
                throw ex;
            }
        }


        private static void Configure(HttpConfiguration config)
        {
        
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            
        }
        private static Autofac.IContainer GetDependencyContainer(IAppBuilder app)
        {
            var builder = new ContainerBuilder();



            // Singleton

            // Scoped
            builder.Register(c => new db.GB_DB_Context(ConfigurationManager.ConnectionStrings["Default"].ConnectionString, TimeSpan.FromMinutes(30))).InstancePerRequest();
            builder.RegisterType<ApplicationUserManager>().InstancePerRequest();
            builder.RegisterType<ApplicationSignInManager>().InstancePerRequest();
           
            builder.Register(c => c.Resolve<IOwinContext>().Authentication).As<IAuthenticationManager>().InstancePerRequest();
            builder.RegisterType<ApplicationUserManager>().InstancePerRequest();
            builder.RegisterType<ApplicationSignInManager>().InstancePerRequest();
          

            //builder.RegisterType<DashboardService>().AsSelf().InstancePerRequest();
     

           
            return builder.Build();
        }
    }
}

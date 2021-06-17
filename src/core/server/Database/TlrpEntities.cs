using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Reflection;
using triallife.Database.Models;
using triallife.Utility;

namespace triallife.Database {
	public class TlrpEntities : DbContext {
		private static string connection;
		public static void Initialize() {
			var json = File.ReadAllText($"{AppContext.BaseDirectory}/configs/database.json");
			var sqlConfig = JsonConvert.DeserializeObject<SqlConfig>(json);
			connection = $"Server={sqlConfig.server};Database={sqlConfig.database};Uid={sqlConfig.username};Pwd={sqlConfig.password}";
		}
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			optionsBuilder.UseMySql(connection, ServerVersion.AutoDetect(connection), builder => builder.MigrationsAssembly(typeof(TlrpEntities).GetTypeInfo().Assembly.GetName().Name));
		}
		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			
		}

		public DbSet<Account> accounts { get; set; }
	}
}

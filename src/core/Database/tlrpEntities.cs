using AltV.Net.Data;
using AltV.Net.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using core.Usefull;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace core.Database {
	public class TlrpEntities : DbContext {
		private static string connectionString;

		public static void Initialize() {
			var json = File.ReadAllText($"{AppContext.BaseDirectory}configs/database.json");
			var conData = JsonConvert.DeserializeObject<Dictionary<string, object>> (json);
			connectionString = $"Server={conData["serv"]};Database={conData["data"]};Uid={conData["user"]};Pwd={conData["pass"]}";
		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
			optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), optionsBuilder => optionsBuilder.MigrationsAssembly(typeof(TlrpEntities).GetTypeInfo().Assembly.GetName().Name));
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			#region character settings
			modelBuilder.Entity<Character>().Property(e => e.position).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Position>(v));
			modelBuilder.Entity<Character>().Property(e => e.exterior).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Position>(v));
			modelBuilder.Entity<Character>().Property(e => e.design).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Design>(v));
			modelBuilder.Entity<Character>().Property(e => e.info).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<CharInfo>(v));
			modelBuilder.Entity<Character>().Property(e => e.inventory).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<List<List<Item>>>(v));
			modelBuilder.Entity<Character>().Property(e => e.equipment).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<List<Item>>(v));
			modelBuilder.Entity<Character>().Property(e => e.toolbar).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<List<Item>>(v));
			modelBuilder.Entity<Character>().Property(e => e.vehicles).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<List<Database.Vehicle>>(v));
			#endregion
			#region vehicle settings
			modelBuilder.Entity<Vehicle>().Property(e => e.position).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Position>(v));
			modelBuilder.Entity<Vehicle>().Property(e => e.rotation).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Rotation>(v));
			modelBuilder.Entity<Vehicle>().Property(e => e.color).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Color>(v));
			#endregion
			base.OnModelCreating(modelBuilder);
		}

		public DbSet<Account> Accounts { get; set; }
		public DbSet<Character> Characters { get; set; }
	}
}

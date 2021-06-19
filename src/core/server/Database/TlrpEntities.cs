using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Reflection;
using triallife.Database.Models;
using triallife.Configs;
using System.Numerics;
using triallife.Helper;
using System.Collections.Generic;

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
			#region character builder
			modelBuilder.Entity<Character>().Property(e => e.pos).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<Vector3>(v));
			modelBuilder.Entity<Character>().Property(e => e.exterior).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<Vector3>(v));
			modelBuilder.Entity<Character>().Property(e => e.design).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<Design>(v));
			modelBuilder.Entity<Character>().Property(e => e.info).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<CharInfo>(v));
			modelBuilder.Entity<Character>().Property(e => e.inventory).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<Inventory>(v));
			modelBuilder.Entity<Character>().Property(e => e.equipment).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<List<Item>>(v));
			modelBuilder.Entity<Character>().Property(e => e.toolbar).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<List<Item>>(v));
			modelBuilder.Entity<Character>().Property(e => e.vehicles).HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<List<Vehicle>>(v));
			#endregion
		}

		public DbSet<Account> accounts { get; set; }
		public DbSet<Character> characters { get; set; }
	}
}

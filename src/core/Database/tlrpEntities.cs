using AltV.Net.Data;
using AltV.Net.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using roleplay.Usefull;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using static roleplay.Enums.Enums;

namespace roleplay.Database {
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
			#region account settings
			modelBuilder.Entity<Account>().Property(e => e.cleanable).HasConversion(v => v.ToString(), v => (BoolState)Enum.Parse(typeof(BoolState), v));
			#endregion
			#region character settings
			modelBuilder.Entity<Character>().Property(e => e.model).HasConversion(v => v.ToString(), v => (PedModel)Enum.Parse(typeof(PedModel), v));
			modelBuilder.Entity<Character>().Property(e => e.position).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Position>(v));
			modelBuilder.Entity<Character>().Property(e => e.rotation).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Rotation>(v));
			modelBuilder.Entity<Character>().Property(e => e.birthdate).HasConversion<string>();
			modelBuilder.Entity<Character>().Property(e => e.creation).HasConversion<string>();
			modelBuilder.Entity<Character>().Property(e => e.team).HasConversion(v => v.ToString(), v => (TeamState)Enum.Parse(typeof(TeamState), v));
			modelBuilder.Entity<Character>().Property(e => e.arrest).HasConversion<string>();
			modelBuilder.Entity<Character>().Property(e => e.ban).HasConversion(v => v.ToString(), v => (BoolState)Enum.Parse(typeof(BoolState), v));
			modelBuilder.Entity<Character>().Property(e => e.whitelist).HasConversion(v => v.ToString(), v => (BoolState)Enum.Parse(typeof(BoolState), v));
			modelBuilder.Entity<Character>().Property(e => e.unconscious).HasConversion(v => v.ToString(), v => (BoolState)Enum.Parse(typeof(BoolState), v));
			modelBuilder.Entity<Character>().Property(e => e.editable).HasConversion(v => v.ToString(), v => (BoolState)Enum.Parse(typeof(BoolState), v));
			modelBuilder.Entity<Character>().Property(e => e.handy).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Handy>(v));
			modelBuilder.Entity<Character>().Property(e => e.skills).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Skills>(v));
			modelBuilder.Entity<Character>().Property(e => e.design).HasConversion(v=> v.ToString(), v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v));
			modelBuilder.Entity<Character>().Property(e => e.medical).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Dictionary<BodyPart, int>>(v));
			modelBuilder.Entity<Character>().Property(e => e.inventory).HasConversion(v => v.ToString(), v => JsonConvert.DeserializeObject<Inventory>(v));
			#endregion
			#region travel settings
			modelBuilder.Entity<Travel>().Property(e => e.arrival).HasConversion<string>();
			modelBuilder.Entity<Travel>().Property(e => e.type).HasConversion(v => v.ToString(), v => (TravelState)Enum.Parse(typeof(TravelState), v));
			#endregion
			base.OnModelCreating(modelBuilder);
		}

		public DbSet<Account> Accounts { get; set; }
		public DbSet<Character> Characters { get; set; }
		public DbSet<Travel> Travels { get; set; }
		//public DbSet<Vehicle> Vehicles { get; set; }
	}
}

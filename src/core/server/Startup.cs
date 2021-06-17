using AltV.Net;
using triallife.Database;
using triallife.Utility;

namespace triallife {
	public class Startup : Resource {
		public override void OnStart() {
			TlrpEntities.Initialize();
			using var db = new TlrpEntities();
			db.Database.EnsureCreated();
			Logger.Info("Trial Life wurde gestartet");
		}

		public override void OnStop() {
			Logger.Info("Trial Life wurde gestoppt");
		}
	}
}

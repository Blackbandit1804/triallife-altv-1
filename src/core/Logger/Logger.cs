using System;
using System.IO;

namespace roleplay {
	static class Logger {
		private static string LogData;

		public static void Initialize() {
			try {
				LogData = File.ReadAllText($"{AppContext.BaseDirectory}/logs/{DateTime.Now:dd.MM.yyyy}.log");
				LogData += "-----------------------------------------------------------------\n";
			} catch (Exception) {
				LogData = "-----------------------------------------------------------------\n";
			}
		}

		public static void Uninitialize() {
			File.WriteAllText($"{AppContext.BaseDirectory}/logs/{DateTime.Now:dd.MM.yyyy}.log", LogData);
		}

		public static void LogColored(string[] message, ConsoleColor[] colors) {
			LogData += $"[{DateTime.Now:HH:mm:ss}] ";
			Console.ForegroundColor = ConsoleColor.Gray;
			Console.Write($"[{DateTime.Now:HH:mm:ss}] ");
			if (colors.Length > 0) {
				for (int i = 0; i < message.Length; i++) {
					Console.ForegroundColor = colors[i];
					LogData += message[i];
					Console.Write($"{message[i]}");
				}
			} else {
				for (int i = 0; i < message.Length; i++) {
					LogData += message[i];
					Console.Write($"{message[i]}");
				}
			}
			LogData += "\n";
			Console.ResetColor();
			Console.WriteLine();
		}

		public static void LogError(string[] message) {
			LogData += $"[{DateTime.Now:HH:mm:ss}] [Error]";
			Console.ForegroundColor = ConsoleColor.Gray;
			Console.Write($"[{DateTime.Now:HH:mm:ss}] ---> ");
			Console.ForegroundColor = ConsoleColor.DarkRed;
			for (int i = 0; i < message.Length; i++) {
				LogData += message[i];
				Console.Write($"{message[i]}");
			}
			LogData += "\n";
			Console.ResetColor();
			Console.WriteLine();
		}

		public static void LogWarning(string[] message) {
			LogData += $"[{DateTime.Now:HH:mm:ss}] [Warning]";
			Console.ForegroundColor = ConsoleColor.Gray;
			Console.Write($"[{DateTime.Now:HH:mm:ss}] ---> ");
			Console.ForegroundColor = ConsoleColor.DarkYellow;
			for (int i = 0; i < message.Length; i++) {
				LogData += message[i];
				Console.Write($"{message[i]}");
			}
			LogData += "\n";
			Console.ResetColor();
			Console.WriteLine();
		}
	}
}

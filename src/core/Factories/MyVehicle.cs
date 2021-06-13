using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using System;
using static roleplay.Enums.Enums;

namespace roleplay.Factories {
    public class MyVehicle : Vehicle {
        public static double MaxFuel = 60.0f;
        public FuelType FuelType { get; set; }
        public double Fuel { get; set; }
        public MyVehicle(IntPtr nativePointer, ushort id) : base(nativePointer, id) {
            FuelType = FuelType.None;
        }

        public MyVehicle(uint model, Position position, Rotation rotation, FuelType fuelType = FuelType.None) : base(model, position, rotation) {
            FuelType = fuelType;
            Fuel = 0;
            ManualEngineControl = true;
        }

        public void ToggleEngine() {
            if (!EngineOn && FuelType != FuelType.None && Fuel == 0.0) {
                return;
            }
            EngineOn = !EngineOn;
		}

        public void ToggleRepair() {
            if (NetworkOwner == null) return;
            Fuel = MaxFuel;
            Repair();
		}
    }

	public class MyVehicleFactory : IEntityFactory<IVehicle> {
		public IVehicle Create(IntPtr nativePointer, ushort id) {
            return new MyVehicle(nativePointer, id);
		}
	}
}

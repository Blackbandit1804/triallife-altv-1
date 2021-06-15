using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using core.configs;
using core.Usefull;
using System;
using System.Collections.Generic;
using static core.Usefull.Enums;

namespace core.Factories {
    public class MyVehicle : AltV.Net.Elements.Entities.Vehicle {
        public LockState tlrpLockState { get; set; }
        public bool engineStatus { get; set; }
        public List<string> keys { get; set; }
        public double fuel { get; set; }
        public int playerId { get; set; }
        public VehicleBehavior behavior { get; set; }
        public Database.Vehicle data { get; set; }
        public long nextSave { get; set; }
        public long nextUpdate { get; set; }

        public MyVehicle(IntPtr nativePointer, ushort id) : base(nativePointer, id) {
            tlrpLockState = Enums.LockState.LOCKED;
            engineStatus = false;
            keys = new List<string>();
            fuel = 100.0;
            playerId = 0;
            behavior = VehicleBehavior.UNLIMITED_FUEL;
            this.data = data;
            nextSave = DateTime.Now.AddMilliseconds(DefaultConfig.TIME_BETWEEN_VEHICLE_SAVES).Ticks;
            nextUpdate = DateTime.Now.AddMilliseconds(DefaultConfig.TIME_BETWEEN_VEHICLE_UPDATES).Ticks;
            ManualEngineControl = true;
        }
        public MyVehicle(uint model, Position position, Rotation rotation, Database.Vehicle data = null) : base(model, position, rotation) {
            tlrpLockState = Enums.LockState.LOCKED;
            engineStatus = false;
            keys = new List<string>();
            fuel = 100.0;
            playerId = 0;
            behavior = VehicleBehavior.CONSUMES_FUEL;
            this.data = data;
            nextSave = DateTime.Now.AddMilliseconds(DefaultConfig.TIME_BETWEEN_VEHICLE_SAVES).Ticks;
            nextUpdate = DateTime.Now.AddMilliseconds(DefaultConfig.TIME_BETWEEN_VEHICLE_UPDATES).Ticks;
            ManualEngineControl = true;
        }
    }

	public class MyVehicleFactory : IEntityFactory<IVehicle> {
		public IVehicle Create(IntPtr nativePointer, ushort id) {
            return new MyVehicle(nativePointer, id);
		}
	}
}

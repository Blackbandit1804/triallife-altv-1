using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Helper {

    public enum Permission {
        None = 0,
        Supporter = 1,
        Moderator = 2,
        Admin = 4,
        Owner = 8
    }

    public enum ItemType {
        NONE = 0,
        CAN_DROP = 1,
        CAN_STACK = 2,
        CAN_TRADE = 4,
        IS_EQUIPMENT = 8,
        IS_TOOLBAR = 16,
        IS_WEAPON = 32,
        DESTROY_ON_DROP = 64,
        CONSUMABLE = 128,
        SKIP_CONSUMABLE = 256
    }

    public enum EquipmentType {
        HAT = 0,
        MASK = 1,
        SHIRT = 2,
        PANTS = 3,
        FEET = 4,
        GLASSES = 5,
        EARS = 6,
        BAG = 7,
        ARMOUR = 8
    }
}

export var Permissions;
(function (Permissions) {
    Permissions[Permissions["None"] = 0] = "None";
    Permissions[Permissions["Supporter"] = 1] = "Supporter";
    Permissions[Permissions["Moderator"] = 2] = "Moderator";
    Permissions[Permissions["Admin"] = 4] = "Admin";
    Permissions[Permissions["Owner"] = 8] = "Owner";
})(Permissions || (Permissions = {}));

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var nextUserId = 1; // Generate unique ID
var users = []; // Simple in-memory data storage
// Create User
function createUser(userData) {
    var newUser = __assign({ id: nextUserId++ }, userData);
    users.push(newUser);
    return newUser;
}
// Update User
function updateUser(id, updates) {
    var user = users.find(function (u) { return u.id === id; });
    if (!user) {
        throw new Error("User with id ".concat(id, " not found"));
    }
    Object.assign(user, updates); // Overwrite existing fields with the update object
    return user;
}

// Exercise: Generic Utility Class
var DataStore = /** @class */ (function () {
    function DataStore() {
        this.items = [];
    }
    DataStore.prototype.add = function (item) {
        this.items.push(item);
    };
    DataStore.prototype.findById = function (key, value) {
        // Realization
        return this.items.find(function (item) { return item[key] === value; });
    };
    return DataStore;
}());
// Test Realization
var userStore = new DataStore();
userStore.add({ id: 1, name: "Alice", email: "a@a.com", isActive: true });
userStore.add({ id: 2, name: "Bob", email: "b@b.com", isActive: false });
console.log(userStore.findById("id", 1));
console.log(userStore.findById("id", 2));

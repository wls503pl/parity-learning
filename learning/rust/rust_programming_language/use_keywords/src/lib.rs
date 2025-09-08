/*
 * The 'use' keyword
 * The 'use' keyword can be used to import a path into a scope.
 * Imported parts still follow privacy rules.
 */
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
        fn some_function() {}
    }

    pub mod hosting_2 {}
}

/*
 * After using 'use' like this, 'hosting' is available directly in the current scope,
 * so it is equivalent to being defined in the crate root, which is equivalent to "mod hosting"
 */
use crate::front_of_house::hosting;

/*
 * When a path (name) is imported into a scope using `use`, the name becomes private within that scope.
 * 'pub use:' re-exports
 * - Imports an entry into a scope
 * - This entry can be imported by external code into their own scopes
 */
pub use crate::front_of_house::hosting_2;

// You can also use relative paths, where 'front_of_house' itself is located in the crate root
// use front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();

    // Because 'some_function()' is private, even if 'hosting' is introduced here,
    // it cannot be called directly and an error will be reported
    // hosting::some_function();
}

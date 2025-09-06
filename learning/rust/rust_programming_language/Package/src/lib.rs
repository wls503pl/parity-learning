// library crate root
pub mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

/*
 * The same level
 * The function eat_at_restaurant and the module front_of_house are both in the lib.rs file, so they are both in the same crate.
 * The contents of lib.rs implicitly form a module named crate. Therefore, absolute paths start with this crate name.
 * The crate name corresponding to lib.rs is the crate literal.
 */
pub fn eat_at_restaurant() {
    /*
     * Absolute path call
     * The crate literal is followed by the module front_of_house, which is followed by the hosting module
     * The add_to_waitlist function is followed by ::.
     */
    crate::front_of_house::hosting::add_to_waitlist();

    /*
     * Relative path call
     * Since the function eat_at_restaurant and the module front_of_house are at the same level,
     * we can use the module name front_of_house to find the function add_to_waitlist
     */
    front_of_house::hosting::add_to_waitlist();
}

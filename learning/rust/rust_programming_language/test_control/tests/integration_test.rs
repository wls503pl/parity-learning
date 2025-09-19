use test_control; // To test functions in lib.rs, import package named in cargo.toml

mod common; // Importing the common module
#[test]
fn it_adds_two() {
    common::setup(); // in common folder, mod.rs
    assert_eq!(10, test_control::prints_and_returns_10(8));
}

// Deep understanding of lifetime
// This file demonstrates basic lifetime concepts in Rust

fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    // Example 1: Basic lifetime annotation
    let result = longest(string1.as_str(), string2);
    println!("The longest string is: {}", result);

    // Example 2: Single parameter lifetime
    let result2 = return_first(string1.as_str(), string2);
    println!("First string is: {}", result2);

    // Example 3: Returning owned value instead of reference
    let result3 = create_new_string();
    println!("New string: {}", result3);
}

// Function that compares two string slices and returns the longer one
// Both parameters and return value must have the same lifetime 'a
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// If we only return x, then only x needs lifetime annotation
// y doesn't need lifetime constraint since return value only relates to x
fn return_first<'a>(x: &'a str, y: &str) -> &'a str {
    println!("Returning the first parameter: {}", x);
    x
}

// This function returns an owned String instead of a reference
// No lifetime annotation needed because we're transferring ownership
fn create_new_string() -> String {
    let result = String::from("This is a new string");
    println!("Created new string internally");
    result // Transfer ownership to caller
}

// This would cause a compilation error due to dangling reference:
/*
fn invalid_function<'a>() -> &'a str {
    let local_string = String::from("local");
    local_string.as_str() // ERROR: returning reference to local variable
}
*/

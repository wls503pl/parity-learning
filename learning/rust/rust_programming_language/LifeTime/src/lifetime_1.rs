// Rust Lifetimes Part 1
// Lifetime: the scope for which a reference is valid
// Main goal: prevent dangling references

// ===== Example 1: Dangling reference problem =====
// This code will not compile
/*
fn main() {
    let r;              // r declared without initialization

    {
        let x = 5;
        r = &x;         // Error: x doesn't live long enough
    }                   // x is dropped here

    println!("r: {}", r); // Error: r points to invalid memory
}
*/

// ===== Example 2: Correct lifetime usage =====
fn correct_example() {
    let x = 5; // x lifetime starts
    let r = &x; // r references x, x is still alive
    println!("r: {}", r); // Works fine
}

// ===== Example 3: Lifetime in different scopes =====
fn scope_example() {
    let outer = 10;
    println!("outer: {}", outer);

    {
        let inner = 20;
        let inner_ref = &inner;
        println!("inner_ref: {}", inner_ref);
    } // inner is dropped here

    println!("outer still valid: {}", outer);
}

// ===== Example 4: Function without lifetime annotation =====
// This will not compile - missing lifetime specifier
/*
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
*/

// ===== Example 5: Function with lifetime parameter =====
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// ===== Example 6: Using lifetime parameters =====
fn lifetime_example() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}

fn main() {
    println!("=== Rust Lifetimes Part 1 ===\n");

    correct_example();
    scope_example();
    lifetime_example();

    println!("\nKey concepts:");
    println!("- Lifetime prevents dangling references");
    println!("- Most lifetimes are implicit and inferred");
    println!("- Manual annotation needed when ambiguous");
    println!("- 'a syntax describes relationship between references");
}

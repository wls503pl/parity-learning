// Rust Lifetime Annotation Syntax Part 2
// Lifetime annotations do not change the length of reference lifetimes
// When generic lifetime parameters are specified, functions can accept references with any lifetime

fn main() {
    println!("=== Rust Lifetime Annotation Syntax Examples ===\n");

    // Example 1: Basic lifetime annotations
    basic_lifetime_examples();

    // Example 2: Correct function usage
    correct_usage_example();

    // Example 3: Demonstrate lifetime constraints
    lifetime_constraint_example();
}

// Basic lifetime annotation examples
fn basic_lifetime_examples() {
    println!("1. Basic lifetime annotation syntax:");

    let x = 42;
    let y = String::from("hello");

    // &i32                 - a reference
    // &'a i32              - a reference with explicit lifetime
    // &'a mut i32          - a mutable reference with explicit lifetime

    println!("   Regular reference: {:p}", &x);
    println!("   String reference: {:p}", &y);
    println!();
}

// longest function - demonstrates lifetime parameters
// Generic lifetime parameters are declared in <> between function name and parameter list
// This means: both parameters and return value must have the same lifetime 'a
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    // This function signature tells Rust:
    // 1. There is a lifetime 'a
    // 2. Both string slice parameters must live at least as long as 'a
    // 3. The return value also has lifetime 'a
    //
    // Important: We haven't changed the lifetimes of input or return values
    // We're just providing constraints to the borrow checker for illegal call detection

    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// Example of correct usage of longest function
fn correct_usage_example() {
    println!("2. Correct lifetime usage:");

    let string1 = String::from("long string is long");
    let string2 = String::from("xyz");

    // This works fine because both strings are in the same scope
    let result = longest(string1.as_str(), string2.as_str());
    println!("   The longest string is: '{}'", result);
    println!();
}

// Example demonstrating lifetime constraints
fn lifetime_constraint_example() {
    println!("3. Lifetime constraint demonstration:");

    let string1 = String::from("abcd");

    {
        let string2 = String::from("xyz");
        // Using within this scope is safe
        let temp_result = longest(string1.as_str(), string2.as_str());
        println!("   Temporary result: '{}'", temp_result);

        // If we try to assign the result to an outer scope variable, we get a compile error
        // let result = longest(string1.as_str(), string2.as_str());
        // println!("The longest string is {}", result); // This would error if uncommented
    }

    // Explanation of why the above code would error:
    // The actual lifetime of 'a is the smaller of the two lifetimes x and y
    // string2 is destroyed when the inner scope ends, but result needs to be used in outer scope
    // Even though longest actually returns string1, the compiler doesn't know this
    // It only knows the return value's lifetime is the shorter of x and y lifetimes

    println!("   Lifetime constraints ensure memory safety");

    // This works because both strings are in the same scope as the usage
    let result_safe = longest(string1.as_str(), "xyz");
    println!("   Safe result: '{}'", result_safe);
    println!();
}

// Demonstrate function with different lifetime parameters
fn first_word<'a>(s: &'a str) -> &'a str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

// Test first_word function
#[allow(dead_code)]
fn test_first_word() {
    let my_string = String::from("hello world");
    let word = first_word(&my_string);
    println!("First word: '{}'", word);
}

// Demonstrate multiple lifetime parameters
#[allow(dead_code)]
fn announce_and_return_part<'a, 'b>(announcement: &'a str, x: &'b str, y: &'b str) -> &'b str {
    println!("Attention: {}", announcement);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

/*
Important Concept Summary:

1. Lifetime annotation syntax:
   - Starts with '
   - Usually lowercase and short (like 'a)
   - Placed after & symbol, separated by space

2. Meaning of lifetime annotations:
   - Describe relationships between lifetimes of multiple references
   - Do not affect actual lifetime lengths
   - Provide constraint information for borrow checker

3. Lifetimes in function signatures:
   - Generic lifetime parameters declared in <>
   - All references using same lifetime parameter must satisfy constraints
   - Actual lifetime is the shortest among all related references

4. How the compiler works:
   - Checks lifetime constraints at compile time
   - Ensures references are always valid when used
   - Prevents dangling pointers and memory safety issues
*/

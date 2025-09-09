// String1.rs - Comprehensive String Handling in Rust
// Author: Peile Wu
// Contact: peile.wu.1990@gmail.com
// Date: September 9, 2025

fn main() {
    println!("=== Rust String Fundamentals ===\n");

    // String creation examples
    string_creation_examples();

    // String updating examples
    string_updating_examples();

    // String concatenation examples
    string_concatenation_examples();
}

/// Demonstrates different ways to create String and &str
fn string_creation_examples() {
    println!("1. String Creation Examples:");
    println!("{}", "-".repeat(40));

    // Creating empty String
    let empty_string = String::new();
    println!("Empty string: '{}'", empty_string);

    // Using to_string() method on string literal
    let data = "initial contents";
    let s = data.to_string();
    println!("Using to_string() on variable: '{}'", s);

    // Direct to_string() on string literal
    let s1 = "initial contents".to_string();
    println!("Direct to_string(): '{}'", s1);

    // Using String::from() function
    let s2 = String::from("initial contents");
    println!("Using String::from(): '{}'", s2);

    // String slice (&str) examples
    let string_literal = "This is a string literal"; // &str type
    println!("String literal (&str): '{}'", string_literal);

    println!("\n");
}

/// Demonstrates string updating with push_str() and push()
fn string_updating_examples() {
    println!("2. String Updating Examples:");
    println!("{}", "-".repeat(40));

    // Using push_str() to append string slice
    let mut s = String::from("foo");
    s.push_str("bar");
    println!("After push_str('bar'): '{}'", s);

    // push_str() doesn't take ownership
    let s1 = String::from("!!!");
    s.push_str(&s1);
    println!("After push_str(&s1): '{}'", s);
    println!("s1 is still available: '{}'", s1);

    // Using push() to append single character
    let mut s2 = String::from("lo");
    s2.push('l');
    println!("After push('l'): '{}'", s2);

    println!("\n");
}

/// Demonstrates different string concatenation methods
fn string_concatenation_examples() {
    println!("3. String Concatenation Examples:");
    println!("{}", "-".repeat(40));

    // Using + operator (takes ownership of first string)
    let s1 = String::from("Hello, ");
    let s2 = String::from("World!");

    let s3 = s1 + &s2; // s1 is moved here, can't use s1 after this
    println!("Using + operator: '{}'", s3);
    println!("s2 is still available: '{}'", s2);
    // println!("{}", s1); // This would cause a compile error!

    // Complex concatenation with + (messy for multiple strings)
    let s4 = String::from("tic");
    let s5 = String::from("tac");
    let s6 = String::from("toe");

    let complex_concat = s4 + "-" + &s5 + "-" + &s6;
    println!("Complex + concatenation: '{}'", complex_concat);
    // s4 is moved, s5 and s6 are still available
    println!("s5 is still available: '{}'", s5);
    println!("s6 is still available: '{}'", s6);

    // Using format! macro (doesn't take ownership)
    let s7 = String::from("tic");
    let s8 = String::from("tac");
    let s9 = String::from("toe");

    let formatted_string = format!("{}-{}-{}", s7, s8, s9);
    println!("Using format! macro: '{}'", formatted_string);

    // All variables are still available after format!
    println!("s7 is still available: '{}'", s7);
    println!("s8 is still available: '{}'", s8);
    println!("s9 is still available: '{}'", s9);

    // More complex format! examples
    let name = "Rust";
    let version = "1.72";
    let description = format!("Welcome to {} version {}!", name, version);
    println!("Complex format!: '{}'", description);

    println!("\n");
}

/// Additional helper function to demonstrate string types
#[allow(dead_code)]
fn demonstrate_string_types() {
    println!("4. String Types in Rust:");
    println!("{}", "-".repeat(40));

    // &str (string slice) - immutable reference to string data
    let string_slice: &str = "I am a string slice";
    println!("String slice (&str): '{}'", string_slice);

    // String - owned, growable string
    let owned_string: String = String::from("I am an owned String");
    println!("Owned String: '{}'", owned_string);

    // Converting between types
    let slice_to_string: String = string_slice.to_string();
    let string_to_slice: &str = &owned_string;

    println!("Converted slice to String: '{}'", slice_to_string);
    println!("Converted String to slice: '{}'", string_to_slice);

    // UTF-8 encoding examples
    let chinese = String::from("你好");
    let emoji = String::from("🦀 Rust!");
    let mixed = String::from("Hello 世界 🌍");

    println!("Chinese: '{}'", chinese);
    println!("Emoji: '{}'", emoji);
    println!("Mixed UTF-8: '{}'", mixed);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_string_creation() {
        let s1 = String::new();
        let s2 = "test".to_string();
        let s3 = String::from("test");

        assert_eq!(s1, "");
        assert_eq!(s2, "test");
        assert_eq!(s3, "test");
    }

    #[test]
    fn test_string_updating() {
        let mut s = String::from("foo");
        s.push_str("bar");
        s.push('!');

        assert_eq!(s, "foobar!");
    }

    #[test]
    fn test_string_concatenation() {
        let s1 = String::from("Hello");
        let s2 = String::from("World");

        let result1 = s1 + &s2;
        assert_eq!(result1, "HelloWorld");

        let s3 = String::from("foo");
        let s4 = String::from("bar");
        let result2 = format!("{}{}", s3, s4);
        assert_eq!(result2, "foobar");

        // s3 and s4 are still valid after format!
        assert_eq!(s3, "foo");
        assert_eq!(s4, "bar");
    }
}

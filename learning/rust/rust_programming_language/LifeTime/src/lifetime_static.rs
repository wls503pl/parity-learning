// Static lifetime demonstration
// This file shows how 'static lifetime works in Rust

fn main() {
    // Example 1: String literals have 'static lifetime
    let static_str: &'static str = "I have a static lifetime.";
    println!("Static string: {}", static_str);

    // Example 2: Static string can be used anywhere
    let returned_static = return_static_str();
    println!("Returned static: {}", returned_static);

    // Example 3: Static variables
    println!("Global message: {}", GLOBAL_MESSAGE);

    // Example 4: Function that accepts static references
    process_static_data(static_str);
    process_static_data("Another static string literal");

    // Example 5: Demonstrate difference between static and regular lifetimes
    demonstrate_lifetime_difference();

    // Example 6: Static in generic contexts
    let container = StaticContainer::new("Static content");
    container.display();

    // Example 7: Working with static data in collections
    work_with_static_collection();
}

// Global static variable - lives for entire program duration
static GLOBAL_MESSAGE: &str = "This is a global static message";

// Function returning a static string literal
fn return_static_str() -> &'static str {
    "This string literal has static lifetime"
}

// Function that accepts only static string references
fn process_static_data(data: &'static str) {
    println!("Processing static data: {}", data);
    // This data is guaranteed to live for the entire program
}

// Struct that holds static references
struct StaticContainer {
    content: &'static str,
}

impl StaticContainer {
    fn new(content: &'static str) -> Self {
        StaticContainer { content }
    }

    fn display(&self) {
        println!("Static container content: {}", self.content);
    }

    // Method returning static reference
    fn get_content(&self) -> &'static str {
        self.content
    }
}

fn demonstrate_lifetime_difference() {
    // Static lifetime example
    let static_ref = "Static string";
    store_static_reference(static_ref);

    // This would NOT work with non-static data:
    /*
    let owned_string = String::from("Not static");
    store_static_reference(owned_string.as_str()); // Compilation error!
    */

    println!("Static reference is still valid after function calls");
}

fn store_static_reference(s: &'static str) {
    println!("Stored static reference: {}", s);
    // We can store this reference and use it later without worry
}

fn work_with_static_collection() {
    // Vector of static string references
    let static_strings: Vec<&'static str> = vec![
        "First static string",
        "Second static string",
        "Third static string",
    ];

    println!("Static string collection:");
    for (i, s) in static_strings.iter().enumerate() {
        println!("  {}: {}", i + 1, s);
    }

    // We can pass these around freely
    process_string_collection(&static_strings);
}

fn process_string_collection(strings: &[&'static str]) {
    println!("Processing {} static strings", strings.len());
    let longest = strings.iter().max_by_key(|s| s.len());
    if let Some(longest_str) = longest {
        println!("Longest static string: '{}'", longest_str);
    }
}

// Example of when NOT to use 'static
// This function demonstrates a better approach than forcing 'static
fn better_approach(input: &str) -> String {
    // Instead of requiring 'static lifetime, return owned data
    format!("Processed: {}", input.to_uppercase())
}

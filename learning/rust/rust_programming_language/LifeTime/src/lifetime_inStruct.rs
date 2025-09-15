// Struct definitions with lifetime annotations
// This file demonstrates how to use lifetimes in struct definitions

// Struct that holds a reference to a string slice
// The lifetime parameter 'a ensures that the reference in 'part'
// lives at least as long as the struct instance
struct ImportantExcerpt<'a> {
    part: &'a str,
}

// Struct that holds multiple references with different lifetimes
struct MultipleRefs<'a, 'b> {
    first: &'a str,
    second: &'b str,
}

// Struct mixing owned data and references
struct MixedData<'a> {
    name: String,         // Owned data - no lifetime needed
    description: &'a str, // Reference - needs lifetime annotation
    id: u32,              // Owned primitive - no lifetime needed
}

fn main() {
    // Example 1: Basic struct with lifetime
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");

    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };

    println!("Important excerpt: '{}'", excerpt.part);

    // Example 2: Multiple references
    let text1 = "First text";
    let text2 = String::from("Second text");

    let multi_ref = MultipleRefs {
        first: text1,
        second: text2.as_str(),
    };

    println!(
        "First: '{}', Second: '{}'",
        multi_ref.first, multi_ref.second
    );

    // Example 3: Mixed data types
    let description_text = "This is a sample description";
    let mixed = MixedData {
        name: String::from("Sample Item"),
        description: description_text,
        id: 42,
    };

    println!(
        "Name: {}, ID: {}, Description: {}",
        mixed.name, mixed.id, mixed.description
    );

    // Demonstrate scope and lifetime relationship
    demonstrate_scope_relationship();
}

fn demonstrate_scope_relationship() {
    let long_lived_string = String::from("This string lives long");

    {
        // This works because long_lived_string outlives the struct
        let excerpt = ImportantExcerpt {
            part: long_lived_string.as_str(),
        };
        println!("Excerpt in inner scope: '{}'", excerpt.part);
    } // excerpt goes out of scope here, but long_lived_string is still valid

    println!("Original string still exists: {}", long_lived_string);
}

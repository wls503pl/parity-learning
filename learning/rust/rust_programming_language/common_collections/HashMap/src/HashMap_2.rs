use std::collections::HashMap;

fn main() {
    // Example 1: Updating HashMap values - Overwriting existing values
    println!("=== Example 1: Overwriting Values ===");
    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    println!("After first insert: {:?}", scores);

    scores.insert(String::from("Blue"), 25); // This overwrites the previous value
    println!("After overwriting: {:?}", scores); // Prints {"Blue": 25}

    println!();

    // Example 2: Using entry() method for conditional insertion
    println!("=== Example 2: Entry API - VacantEntry ===");
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    // Try to insert "Yellow" - will succeed because key doesn't exist
    // scores.entry(String::from("Yellow")).or_insert(50);
    let e = scores.entry(String::from("Yellow"));
    println!("Entry for 'Yellow' (before insert): {:?}", e);
    e.or_insert(50);

    println!("HashMap after conditional insert: {:?}", scores);

    println!();

    // Example 3: Entry API with existing key (OccupiedEntry)
    println!("=== Example 3: Entry API - OccupiedEntry ===");
    let mut scores = HashMap::new();
    scores.insert(String::from("Yellow"), 10);
    scores.insert(String::from("Blue"), 50);

    scores.entry(String::from("Blue")).or_insert(50);
    println!("HashMap after trying to insert existing key: {:?}", scores);

    println!();

    // Example 4: Word frequency counter using entry() API
    println!("=== Example 4: Word Frequency Counter ===");
    let text = "hello world wonderful world";
    let mut map = HashMap::new();

    println!("Text to analyze: \"{}\"", text);

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }

    println!("Word frequencies:");
    println!("{:#?}", map);

    println!();

    // Example 5: Demonstrating Entry types
    println!("=== Example 5: Entry Types Demonstration ===");
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    // VacantEntry - key doesn't exist
    println!("Checking entry for 'Yellow' (doesn't exist):");
    match scores.entry(String::from("Yellow")) {
        std::collections::hash_map::Entry::Vacant(e) => {
            println!("VacantEntry found for key: {:?}", e.key());
            e.insert(50);
        }
        std::collections::hash_map::Entry::Occupied(e) => {
            println!(
                "OccupiedEntry found for key: {:?}, value: {:?}",
                e.key(),
                e.get()
            );
        }
    }

    // OccupiedEntry - key exists
    println!("Checking entry for 'Blue' (exists):");
    match scores.entry(String::from("Blue")) {
        std::collections::hash_map::Entry::Vacant(e) => {
            println!("VacantEntry found for key: {:?}", e.key());
            e.insert(50);
        }
        std::collections::hash_map::Entry::Occupied(e) => {
            println!(
                "OccupiedEntry found for key: {:?}, value: {:?}",
                e.key(),
                e.get()
            );
        }
    }

    println!("Final HashMap: {:?}", scores);
}

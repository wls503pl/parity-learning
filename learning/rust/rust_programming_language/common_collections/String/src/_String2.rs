fn main() {
    // 1. String internal representation - Vec<u8> wrapper
    println!("=== String Internal Representation ===");

    let s1 = String::from("Hello");
    println!("'Hello' length in bytes: {}", s1.len()); // 5 bytes

    let s2 = String::from("Здравствуйте");
    println!("'Здравствуйте' length in bytes: {}", s2.len()); // 24 bytes (each Cyrillic char = 2 bytes)

    // 2. Why indexing is not allowed
    println!("\n=== Why String Indexing is Prohibited ===");
    // This would cause compile error:
    // let h = s1[0];
    println!("Direct indexing like s1[0] is not allowed in Rust");
    println!("Reason: Each Unicode scalar value may occupy multiple bytes");

    // 3. Three ways to view UTF-8 strings
    println!("\n=== Three Ways to View UTF-8 Strings ===");
    let hindi = "नमस्ते";

    // As bytes
    println!("As bytes:");
    for byte in hindi.bytes() {
        print!("{} ", byte);
    }
    println!();

    // As Unicode scalar values
    println!("As Unicode scalar values:");
    for ch in hindi.chars() {
        print!("{} ", ch);
    }
    println!();

    // Note: Grapheme clusters require external crate
    println!("Grapheme clusters require external crate for proper display");

    // 4. String slicing (must be careful)
    println!("\n=== String Slicing ===");
    let russian = "Здравствуйте";

    // Safe slicing - respects character boundaries
    let slice = &russian[0..4]; // First 2 Cyrillic characters (2 bytes each)
    println!("Safe slice [0..4]: {}", slice); // "Зд"

    // This would panic at runtime:
    // let bad_slice = &russian[0..3]; // Cuts through character boundary
    println!("Slicing [0..3] would panic - cuts through character boundary");

    // 5. Safe string iteration methods
    println!("\n=== Safe String Iteration ===");
    let text = "Rust🦀";

    println!("Iterating by characters:");
    for (i, ch) in text.chars().enumerate() {
        println!("  Index {}: '{}'", i, ch);
    }

    println!("Iterating by bytes:");
    for (i, byte) in text.bytes().enumerate() {
        println!("  Byte {}: {}", i, byte);
    }

    // 6. Why O(1) indexing is impossible
    println!("\n=== Why O(1) Indexing is Impossible ===");
    println!("To find the nth character, Rust would need to:");
    println!("1. Traverse from the beginning");
    println!("2. Count valid UTF-8 character boundaries");
    println!("3. This is O(n) operation, not O(1)");

    // 7. String length vs character count
    println!("\n=== Byte Length vs Character Count ===");
    let mixed = "ABC你好🦀";
    println!("String: {}", mixed);
    println!("Byte length: {}", mixed.len());
    println!("Character count: {}", mixed.chars().count());

    // 8. Safe string manipulation alternatives
    println!("\n=== Safe Alternatives ===");

    // Get first character safely
    if let Some(first_char) = mixed.chars().next() {
        println!("First character: {}", first_char);
    }

    // Get nth character safely
    if let Some(nth_char) = mixed.chars().nth(3) {
        println!("4th character: {}", nth_char);
    }

    // Collect specific range of characters
    let chars: Vec<char> = mixed.chars().skip(1).take(3).collect();
    println!("Characters 2-4: {:?}", chars);
}

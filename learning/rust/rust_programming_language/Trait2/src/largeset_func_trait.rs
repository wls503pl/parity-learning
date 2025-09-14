// Demonstration of fixing the largest function using trait bounds
// Shows PartialOrd trait requirement and Copy vs Clone approaches

// First approach: Using Copy trait
// T must implement PartialOrd for comparison and Copy for moving values
fn largest_with_copy<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0]; // Copy allows us to move the value

    for &item in list.iter() {
        if item > largest {
            // PartialOrd trait enables the '>' operator
            largest = item;
        }
    }
    largest
}

// Second approach: Using Clone trait instead of Copy
// This works for types that don't implement Copy but do implement Clone
fn largest_with_clone<T: PartialOrd + Clone>(list: &[T]) -> T {
    let mut largest = list[0].clone(); // Clone creates a new instance

    for item in list.iter() {
        if *item > largest {
            // Dereference item to compare values
            largest = item.clone(); // Clone the item
        }
    }
    largest
}

// Third approach: Returning a reference instead of owned value
// This avoids the need for Copy or Clone entirely
fn largest_by_reference<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0]; // Work with references

    for item in list.iter() {
        if item > largest {
            // Comparing references
            largest = item;
        }
    }
    largest
}

fn main() {
    // Test with numbers (i32 implements Copy, PartialOrd)
    let number_list = vec![34, 50, 25, 100, 65];

    println!("=== Testing with numbers (Copy + PartialOrd) ===");
    let result = largest_with_copy(&number_list);
    println!("The largest number is {}", result);

    // Test with characters (char implements Copy, PartialOrd)
    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest_with_copy(&char_list);
    println!("The largest char is {}", result);

    // Test with String (does NOT implement Copy, but implements Clone)
    let string_list = vec![
        String::from("hello"),
        String::from("world"),
        String::from("rust"),
        String::from("programming"),
    ];

    println!("\n=== Testing with Strings (Clone + PartialOrd, no Copy) ===");

    // This would fail with largest_with_copy because String doesn't implement Copy
    let result = largest_with_clone(&string_list);
    println!("The largest string is {}", result);

    // Alternative: using references (no Copy or Clone needed)
    let result_ref = largest_by_reference(&string_list);
    println!("The largest string (by reference) is {}", result_ref);

    println!("\n=== Performance Comparison ===");
    println!("• Copy approach: Fast, works with stack-allocated types");
    println!("• Clone approach: Slower, creates new instances, works with heap types");
    println!("• Reference approach: Fastest, no data copying, but returns borrowed data");

    // Demonstrate that the original vector is still available
    println!(
        "\nOriginal string list is still available: {:?}",
        string_list
    );
}

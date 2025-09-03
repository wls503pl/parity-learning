// Example of the Option enumeration
// The Option enumeration is defined in the standard library and in the prelude module
// It describes the conditions under which a value (of a certain type) may or may not exist.

fn main() {
    println!("=== Option Enum Learning Example ===\n");

    // 1. Basic usage of Option enum
    println!("1. Basic usage of Option enum:");

    // Compiler infers that T is i32 type here
    let some_number = Some(5);
    println!("   some_number: {:?}", some_number);

    // Compiler infers that T is string slice type here
    let some_string = Some("A String");
    println!("   some_string: {:?}", some_string);

    // Here the compiler cannot automatically infer what type T is, explicit declaration needed
    // Note that the type is Option<i32> not i32, representing no valid value here
    let absent_number: Option<i32> = None;
    println!("   absent_number: {:?}\n", absent_number);

    // 2. Demonstration that Option<T> and T are different types
    println!("2. Option<T> and T are different types:");

    let x: i8 = 5;
    let y: Option<i8> = Some(5);

    println!("   x (type i8): {}", x);
    println!("   y (type Option<i8>): {:?}", y);

    // The following line would cause compilation error, cannot directly add Option<i8> and i8
    // let sum = x + y;  // error[E0277]: cannot add 'Option<i8>' to 'i8'

    println!("   Note: Cannot directly add Option<i8> and i8!\n");

    // 3. Correct way to use values in Option<T>
    println!("3. Correct way to use values in Option<T>:");

    // Method 1: Using match expression
    match y {
        Some(value) => {
            let sum = x + value;
            println!("   Using match: {} + {} = {}", x, value, sum);
        }
        None => {
            println!("   y is None, cannot calculate");
        }
    }

    // Method 2: Using unwrap_or method to provide default value
    let sum_with_default = x + y.unwrap_or(0);
    println!(
        "   Using unwrap_or: {} + {} = {}",
        x,
        y.unwrap_or(0),
        sum_with_default
    );

    // Method 3: Using if let syntax sugar
    if let Some(value) = y {
        let sum = x + value;
        println!("   Using if let: {} + {} = {}", x, value, sum);
    }

    println!("\n=== Advantages of Option Enum ===");
    println!("• Rust has no Null, avoiding null pointer exceptions");
    println!("• Option<T> forces developers to handle cases where values might not exist");
    println!("• Compiler ensures type safety, preventing direct use of potentially null values");
    println!("• Must explicitly handle None cases, improving code robustness");

    // 4. Demonstration of more Option methods
    println!("\n4. Demonstration of more Option methods:");

    let numbers = vec![Some(1), None, Some(3), Some(4), None];

    // Use filter_map to filter out None values
    let valid_numbers: Vec<i32> = numbers.into_iter().filter_map(|x| x).collect();
    println!("   Valid numbers after filtering: {:?}", valid_numbers);

    // Use map and unwrap_or to handle Option
    let opt_value: Option<i32> = Some(10);
    let doubled = opt_value.map(|x| x * 2);
    println!("   Some(10) multiplied by 2: {:?}", doubled);

    let none_value: Option<i32> = None;
    let doubled_none = none_value.map(|x| x * 2);
    println!("   None multiplied by 2: {:?}", doubled_none);
}

// Demonstration of conditional method implementation using trait bounds
// Shows how to implement methods only for types that satisfy certain traits

use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

// Implementation block for all types T
// This means every Pair<T> will have the 'new' method regardless of what T is
impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }

    // Method available for all Pair<T>
    fn get_values(&self) -> (&T, &T) {
        (&self.x, &self.y)
    }
}

// Conditional implementation: only for types that implement Display + PartialOrd
// This means only Pair<T> where T implements both traits will have 'cmp_display'
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }

    fn display_both(&self) {
        println!("x = {}, y = {}", self.x, self.y);
    }
}

// Additional conditional implementation for types that implement Clone
impl<T: Clone> Pair<T> {
    fn clone_larger(&self) -> T
    where
        T: PartialOrd,
    {
        if self.x >= self.y {
            self.x.clone()
        } else {
            self.y.clone()
        }
    }
}

// Demonstration of blanket implementation concept
// This is similar to how standard library implements ToString for all Display types

trait Summarizable {
    fn summary(&self) -> String;
}

// Blanket implementation: implement Summarizable for all types that implement Display
impl<T: Display> Summarizable for T {
    fn summary(&self) -> String {
        format!("Summary: {}", self)
    }
}

fn main() {
    println!("=== Creating Pair instances ===");

    // Create a Pair<i32> - i32 implements Display and PartialOrd
    let integer_pair = Pair::new(5, 10);

    // Create a Pair<f64> - f64 implements Display and PartialOrd
    let float_pair = Pair::new(3.14, 2.71);

    // Create a Pair<String> - String implements Display and PartialOrd
    let string_pair = Pair::new(String::from("hello"), String::from("world"));

    println!("\n=== Methods available for all Pair<T> ===");
    println!("Integer pair values: {:?}", integer_pair.get_values());
    println!("Float pair values: {:?}", float_pair.get_values());
    println!("String pair values: {:?}", string_pair.get_values());

    println!("\n=== Methods only available for Display + PartialOrd types ===");
    integer_pair.cmp_display();
    float_pair.cmp_display();
    string_pair.cmp_display();

    println!("\n=== Display both values ===");
    integer_pair.display_both();
    float_pair.display_both();
    string_pair.display_both();

    println!("\n=== Clone larger value (requires Clone + PartialOrd) ===");
    let larger_int = integer_pair.clone_larger();
    println!("Larger integer: {}", larger_int);

    let larger_string = string_pair.clone_larger();
    println!("Larger string: {}", larger_string);

    println!("\n=== Demonstrating blanket implementation ===");
    // Any type that implements Display automatically gets Summarizable
    let number = 42;
    let text = "Hello, Rust!";

    println!("Number summary: {}", number.summary());
    println!("Text summary: {}", text.summary());

    // This demonstrates how to_string() works in the standard library
    // The standard library implements ToString for all types that implement Display
    let number_as_string = number.to_string();
    println!("Number as string: {}", number_as_string);

    println!("\n=== Key Concepts ===");
    println!("• Conditional implementations allow methods only for specific trait combinations");
    println!("• Blanket implementations provide traits for all types meeting criteria");
    println!("• This enables flexible and powerful generic programming patterns");
}

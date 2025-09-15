// Combining generic parameters, trait bounds, and lifetimes
// This file demonstrates advanced usage of generics with lifetimes

use std::fmt::Display;

fn main() {
    // Example 1: Function with generics, lifetimes, and trait bounds
    let str1 = "Hello";
    let str2 = "World!";
    let announcement = "Important announcement";

    let result = longest_with_announcement(str1, str2, announcement);
    println!("Result: {}", result);

    // Example 2: With different types that implement Display
    let number_announcement = 42;
    let result2 = longest_with_announcement("short", "longer string", number_announcement);
    println!("Result with number: {}", result2);

    // Example 3: Complex struct with multiple generic parameters - FIXED
    let analyzer = ComplexAnalyzer::new("Sample text", "Reference text", "metadata", 100);
    analyzer.analyze_and_display();

    let comparison = analyzer.compare_texts("External text");
    println!("Comparison result: {}", comparison);

    // Example 4: Working with different trait implementations
    demonstrate_multiple_traits();
}

// Function combining lifetime 'a, generic type T with trait bound Display
// Returns the longer of two string slices and prints an announcement
fn longest_with_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: Display,
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        println!("First string '{}' is longer", x);
        x
    } else {
        println!("Second string '{}' is longer or equal", y);
        y
    }
}

// Struct with multiple generic parameters: lifetime, type, and numeric type
struct ComplexAnalyzer<'a, T, U>
where
    T: Display + Clone,
    U: Copy + PartialOrd + Display,
{
    primary_text: &'a str,
    secondary_text: &'a str,
    metadata: T,
    threshold: U,
}

impl<'a, T, U> ComplexAnalyzer<'a, T, U>
where
    T: Display + Clone,
    U: Copy + PartialOrd + Display,
{
    fn new(primary: &'a str, secondary: &'a str, metadata: T, threshold: U) -> Self {
        ComplexAnalyzer {
            primary_text: primary,
            secondary_text: secondary,
            metadata,
            threshold,
        }
    }

    fn analyze_and_display(&self) {
        println!("=== Text Analysis ===");
        println!(
            "Primary: '{}' (length: {})",
            self.primary_text,
            self.primary_text.len()
        );
        println!(
            "Secondary: '{}' (length: {})",
            self.secondary_text,
            self.secondary_text.len()
        );
        println!("Metadata: {}", self.metadata);
        println!("Threshold: {}", self.threshold);
    }

    // Method with additional lifetime parameter for external reference
    fn compare_texts<'b>(&self, external: &'b str) -> &str
    where
        'b: 'a, // external must outlive the struct's lifetime
    {
        let lengths = [
            (self.primary_text, self.primary_text.len()),
            (self.secondary_text, self.secondary_text.len()),
            (external, external.len()),
        ];

        let longest = lengths.iter().max_by_key(|(_, len)| len);
        match longest {
            Some((text, _)) => {
                if text == &external {
                    println!("External text is longest");
                    external
                } else {
                    println!("Internal text is longest: '{}'", text);
                    if text == &self.primary_text {
                        self.primary_text
                    } else {
                        self.secondary_text
                    }
                }
            }
            None => self.primary_text,
        }
    }

    // Method returning owned data combining generics
    fn create_summary(&self) -> String {
        format!(
            "Summary - Primary: {} chars, Secondary: {} chars, Metadata: {}, Threshold: {}",
            self.primary_text.len(),
            self.secondary_text.len(),
            self.metadata,
            self.threshold
        )
    }
}

// Trait for additional functionality
trait Analyzable {
    fn word_count(&self) -> usize;
}

// Implement trait for string slices
impl Analyzable for str {
    fn word_count(&self) -> usize {
        self.split_whitespace().count()
    }
}

// Function using multiple trait bounds
fn analyze_with_traits<'a, T>(text: &'a str, processor: T) -> String
where
    T: Display + Clone,
{
    let word_count = text.word_count();
    format!(
        "Text: '{}' | Words: {} | Processor: {}",
        text, word_count, processor
    )
}

fn demonstrate_multiple_traits() {
    println!("\n=== Multiple Trait Demonstration ===");

    let sample_text = "This is a sample text for analysis";

    // Using different types that implement Display
    let result1 = analyze_with_traits(sample_text, "String Processor");
    println!("{}", result1);

    let result2 = analyze_with_traits(sample_text, 42);
    println!("{}", result2);

    // Complex analyzer with different type combinations - FIXED parameters
    let str_analyzer = ComplexAnalyzer::new(
        "First text",
        "Second longer text",
        "String metadata", // metadata parameter
        50,                // threshold parameter
    );

    let summary = str_analyzer.create_summary();
    println!("String analyzer: {}", summary);

    let num_analyzer = ComplexAnalyzer::new(
        "Short",
        "Much longer text here",
        42.5, // metadata parameter (f64)
        100,  // threshold parameter
    );

    let num_summary = num_analyzer.create_summary();
    println!("Numeric analyzer: {}", num_summary);
}

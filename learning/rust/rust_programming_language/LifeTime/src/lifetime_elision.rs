// Lifetime elision rules
// This file demonstrates when Rust can infer lifetimes automatically

fn main() {
    let text = "Hello world programming";

    // Example 1: Single parameter - lifetime elision works
    let first = first_word(text);
    println!("First word: '{}'", first);

    // Example 2: Multiple parameters with &self - elision works in methods
    let sentence = Sentence::new("Rust is amazing for systems programming");
    let word = sentence.get_first_word();
    println!("First word from method: '{}'", word);

    // Example 3: Function that needs explicit lifetime annotation
    let text1 = "short";
    let text2 = "much longer text";
    let longer = longest_explicit(text1, text2);
    println!("Longer text: '{}'", longer);
}

// Rule 1: Each reference parameter gets its own lifetime
// Rule 2: If there's exactly one input lifetime, it's assigned to all outputs
// This function compiles without explicit lifetime annotations
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

// Function that requires explicit lifetime annotation
// Multiple input parameters, no &self, so elision rules don't apply
fn longest_explicit<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// Struct to demonstrate method lifetime elision
struct Sentence<'a> {
    content: &'a str,
}

impl<'a> Sentence<'a> {
    fn new(content: &'a str) -> Self {
        Sentence { content }
    }

    // Rule 3: If one of multiple parameters is &self or &mut self,
    // the lifetime of self is assigned to all output parameters
    // This method compiles without explicit lifetime annotations
    fn get_first_word(&self) -> &str {
        self.content.split_whitespace().next().unwrap_or("")
    }

    // Method with additional parameter - still uses self's lifetime for output
    fn get_word_after(&self, _delimiter: &str) -> &str {
        // Simplified implementation
        self.content.split_whitespace().nth(1).unwrap_or("")
    }

    // Method returning owned data - no lifetime issues
    fn word_count(&self) -> usize {
        self.content.split_whitespace().count()
    }
}

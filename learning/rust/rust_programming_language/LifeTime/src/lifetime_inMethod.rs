// Lifetime annotations in method definitions
// This file demonstrates how lifetimes work with struct methods

struct ImportantExcerpt<'a> {
    part: &'a str,
}

// The impl block needs the lifetime parameter declaration
impl<'a> ImportantExcerpt<'a> {
    // Method that doesn't return references - no additional lifetime needed
    fn level(&self) -> i32 {
        println!("Getting importance level");
        3
    }

    // Method with multiple parameters returning a reference
    // Due to lifetime elision rules, &self's lifetime is used for return value
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }

    // Method that returns the longer of two string references
    // Explicit lifetime annotation needed since we have multiple input lifetimes
    fn compare_with_announcement<'b>(&self, announcement: &'b str) -> &str
    where
        'b: 'a, // 'b must outlive 'a
    {
        if self.part.len() > announcement.len() {
            println!("Original part is longer");
            self.part
        } else {
            println!("Announcement is longer, but returning original part");
            self.part // Always return self.part for consistency
        }
    }

    // Method that creates and returns owned data
    fn create_summary(&self) -> String {
        format!("Summary: {} (length: {})", self.part, self.part.len())
    }

    // Method that modifies internal state (if we had mutable fields)
    fn get_length(&self) -> usize {
        println!("Calculating length of: '{}'", self.part);
        self.part.len()
    }
}

// Additional struct to demonstrate more complex lifetime scenarios
struct TextAnalyzer<'a> {
    primary_text: &'a str,
    backup_text: &'a str,
}

impl<'a> TextAnalyzer<'a> {
    fn new(primary: &'a str, backup: &'a str) -> Self {
        TextAnalyzer {
            primary_text: primary,
            backup_text: backup,
        }
    }

    // Method returning one of the stored references
    fn get_primary(&self) -> &str {
        println!("Returning primary text");
        self.primary_text
    }

    // Method choosing between stored references
    fn get_longer_text(&self) -> &str {
        if self.primary_text.len() >= self.backup_text.len() {
            println!("Primary text is longer or equal");
            self.primary_text
        } else {
            println!("Backup text is longer");
            self.backup_text
        }
    }
}

fn main() {
    // Example 1: Basic method usage
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");

    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };

    println!("Importance level: {}", excerpt.level());

    let announcement = "Breaking news";
    let returned_part = excerpt.announce_and_return_part(announcement);
    println!("Returned part: '{}'", returned_part);

    // Example 2: Method with lifetime constraints
    let comparison_result = excerpt.compare_with_announcement("Short");
    println!("Comparison result: '{}'", comparison_result);

    // Example 3: Methods returning owned data
    let summary = excerpt.create_summary();
    println!("Summary: {}", summary);

    println!("Text length: {}", excerpt.get_length());

    // Example 4: TextAnalyzer usage
    let primary = "This is the primary text for analysis";
    let backup = "Backup";

    let analyzer = TextAnalyzer::new(primary, backup);
    println!("Primary: '{}'", analyzer.get_primary());
    println!("Longer: '{}'", analyzer.get_longer_text());
}

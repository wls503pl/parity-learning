// lib.rs - Trait and struct definitions

// Basic Trait definition
pub trait Summary {
    fn summarize(&self) -> String;
}

// NewsArticle struct
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

// Implement Summary trait for NewsArticle
impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

// Tweet struct
pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

// Implement Summary trait for Tweet
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

// Trait with default implementation
pub trait SummaryWithDefault {
    fn summarize(&self) -> String {
        String::from("(Read more ...)")
    }
}

// Use default implementation for NewsArticle
impl SummaryWithDefault for NewsArticle {}

// Use default implementation for Tweet
impl SummaryWithDefault for Tweet {}

// Trait with default implementation calling other methods
pub trait SummaryWithAuthor {
    fn summarize_author(&self) -> String;

    // Default implementation calling other method
    fn summarize(&self) -> String {
        format!("(Read more from {} ...)", self.summarize_author())
    }
}

// Implement SummaryWithAuthor for NewsArticle
impl SummaryWithAuthor for NewsArticle {
    fn summarize_author(&self) -> String {
        format!("@{}", self.author)
    }
}

// Implement SummaryWithAuthor for Tweet
impl SummaryWithAuthor for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }

    // Override default implementation
    fn summarize(&self) -> String {
        format!("Tweet by {}: {}", self.summarize_author(), self.content)
    }
}

// Function using trait as parameter
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

// Function returning trait implementation
pub fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("system"),
        content: String::from("Generated tweet"),
        reply: false,
        retweet: false,
    }
}

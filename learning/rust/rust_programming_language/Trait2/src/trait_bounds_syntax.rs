// Demonstration of Trait Bound syntax for complex situations
// impl Trait is actually just syntactic sugar for Trait Bounds

use std::fmt::Display;

pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

impl Display for NewsArticle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "NewsArticle: {}", self.headline)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

impl Display for Tweet {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Tweet by {}", self.username)
    }
}

// Using impl Trait - both parameters can be different types
pub fn notify1(item1: impl Summary, item2: impl Summary) {
    println!("First item: {}", item1.summarize());
    println!("Second item: {}", item2.summarize());
}

// Using Trait Bounds - both parameters must be the same type T
pub fn notify2<T: Summary>(item1: T, item2: T) {
    println!("First item: {}", item1.summarize());
    println!("Second item: {}", item2.summarize());
}

// Multiple trait bounds using '+' operator
pub fn notify_with_display1(item: impl Summary + Display) {
    println!("Breaking news! {}", item.summarize());
    println!("Display format: {}", item);
}

pub fn notify_with_display2<T: Summary + Display>(item: T) {
    println!("Breaking news! {}", item.summarize());
    println!("Display format: {}", item);
}

fn main() {
    let article1 = NewsArticle {
        headline: String::from("Penguins win the Stanley Cup Championship!"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("Iceburgh"),
        content: String::from("The Pittsburgh Penguins are champions!"),
    };

    let article2 = NewsArticle {
        headline: String::from("Local team celebrates victory"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("Sports Reporter"),
        content: String::from("The celebration continues!"),
    };

    let tweet = Tweet {
        username: String::from("sports_fan"),
        content: String::from("What an amazing game!"),
        reply: false,
        retweet: false,
    };

    println!("=== Demonstrating different parameter types with impl Trait ===");
    notify1(article1, tweet);

    println!("\n=== Demonstrating same parameter types with Trait Bounds ===");
    let article3 = NewsArticle {
        headline: String::from("Hockey season ends"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("Final Reporter"),
        content: String::from("Season recap!"),
    };
    notify2(article2, article3);

    println!("\n=== Demonstrating multiple trait bounds ===");
    let display_article = NewsArticle {
        headline: String::from("Display example"),
        location: String::from("Example City"),
        author: String::from("Demo Author"),
        content: String::from("This demonstrates multiple traits!"),
    };
    notify_with_display1(display_article);
}

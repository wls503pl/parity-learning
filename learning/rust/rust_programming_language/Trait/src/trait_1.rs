// trait_1.rs - Using traits from lib.rs

use demo::NewsArticle;
use demo::Summary;
use demo::SummaryWithAuthor;
use demo::SummaryWithDefault;
use demo::Tweet;
use demo::{notify, returns_summarizable};

fn main() {
    println!("=== Rust Trait Examples ===\n");

    // Basic trait usage
    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    };

    println!("1 new tweet: {}", Summary::summarize(&tweet));

    let article = NewsArticle {
        headline: String::from("Penguins win the Stanley Cup Championship!"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("Iceburgh"),
        content: String::from(
            "The Pittsburgh Penguins once again are the best hockey team in the NHL.",
        ),
    };

    println!("New article available! {}", Summary::summarize(&article));

    // Default implementation usage
    println!("\n--- Default Implementation ---");
    println!(
        "Article default: {}",
        SummaryWithDefault::summarize(&article)
    );
    println!("Tweet default: {}", SummaryWithDefault::summarize(&tweet));

    // Default implementation calling other methods
    println!("\n--- Default Implementation Calling Other Methods ---");
    println!(
        "Article with author: {}",
        SummaryWithAuthor::summarize(&article)
    );
    println!(
        "Tweet with author: {}",
        SummaryWithAuthor::summarize(&tweet)
    );

    // Trait as parameter
    println!("\n--- Trait as Parameter ---");
    notify(&tweet);
    notify(&article);

    // Returning trait implementation
    println!("\n--- Returning Trait Implementation ---");
    let generated_tweet = returns_summarizable();
    println!("Generated: {}", generated_tweet.summarize());

    // Using different traits on same object
    println!("\n--- Same Object, Different Traits ---");
    println!("Basic: {}", Summary::summarize(&article));
    println!("Default: {}", SummaryWithDefault::summarize(&article));
    println!("Author: {}", SummaryWithAuthor::summarize(&article));

    println!("\n=== Done ===");
}

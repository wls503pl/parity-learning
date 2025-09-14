// Demonstration of where clause syntax for cleaner trait bounds
// Alternative syntax that makes complex trait bounds more readable

use std::fmt::{Debug, Display};

pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("News: {}", self.headline)
    }
}

impl Display for NewsArticle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "NewsArticle: {}", self.headline)
    }
}

impl Debug for NewsArticle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "NewsArticle {{ headline: {:?}, content: {:?} }}",
            self.headline, self.content
        )
    }
}

impl Clone for NewsArticle {
    fn clone(&self) -> Self {
        NewsArticle {
            headline: self.headline.clone(),
            content: self.content.clone(),
        }
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("Tweet: {}", self.content)
    }
}

impl Clone for Tweet {
    fn clone(&self) -> Self {
        Tweet {
            username: self.username.clone(),
            content: self.content.clone(),
        }
    }
}

impl Debug for Tweet {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Tweet {{ username: {:?}, content: {:?} }}",
            self.username, self.content
        )
    }
}

// Complex trait bounds in function signature - harder to read
pub fn notify_complex<T: Summary + Display, U: Clone + Debug>(a: T, b: U) -> String {
    format!("Breaking news! {}", a.summarize())
}

// Using where clause to simplify trait bounds - much cleaner
pub fn notify_clean<T, U>(a: T, b: U) -> String
where
    T: Summary + Display,
    U: Clone + Debug,
{
    format!("Breaking news! {}", a.summarize())
}

// Even more complex example with where clause
pub fn complex_function<T, U, V>(item1: T, item2: U, item3: V) -> String
where
    T: Summary + Display + Clone,
    U: Debug + Clone,
    V: Summary + Debug,
{
    let cloned_item1 = item1.clone();
    println!("Cloned item1: {}", cloned_item1);
    println!("Debug item2: {:?}", item2);
    println!("Debug item3: {:?}", item3);

    format!("Processed {} items successfully", 3)
}

fn main() {
    let article = NewsArticle {
        headline: String::from("Rust traits are powerful!"),
        content: String::from("Learning about where clauses and trait bounds"),
    };

    let tweet = Tweet {
        username: String::from("rust_learner"),
        content: String::from("Where clauses make code more readable"),
    };

    println!("=== Demonstrating where clause syntax ===");

    let result1 = notify_complex(article.clone(), tweet.clone());
    println!("Result from complex function: {}", result1);

    let result2 = notify_clean(article.clone(), tweet.clone());
    println!("Result from clean function: {}", result2);

    println!("\n=== Demonstrating complex where clause ===");
    let another_tweet = Tweet {
        username: String::from("advanced_user"),
        content: String::from("Complex trait bounds are manageable with where clauses"),
    };

    let result3 = complex_function(article, tweet, another_tweet);
    println!("Complex function result: {}", result3);
}

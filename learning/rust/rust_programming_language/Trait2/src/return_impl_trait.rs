// Demonstration of returning impl Trait from functions
// Important: impl Trait can only return one concrete type, not different types

pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub content: String,
    pub author: String,
    pub location: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
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

// This works: always returns the same concrete type (NewsArticle)
pub fn returns_news_article(headline: &str) -> impl Summary {
    NewsArticle {
        headline: String::from(headline),
        content: String::from("Some news content here..."),
        author: String::from("News Reporter"),
        location: String::from("News City, Country"),
    }
}

// This works: always returns the same concrete type (Tweet)
pub fn returns_tweet(username: &str, content: &str) -> impl Summary {
    Tweet {
        username: String::from(username),
        content: String::from(content),
        reply: false,
        retweet: false,
    }
}

// This would NOT work - trying to return different types based on condition
// Uncommenting this will cause a compile error
/*
pub fn returns_different_types(switch: bool) -> impl Summary {
    if switch {
        NewsArticle {
            headline: String::from("News headline"),
            content: String::from("News content"),
            author: String::from("Author"),
            location: String::from("Location"),
        }
    } else {
        Tweet {
            username: String::from("user"),
            content: String::from("Tweet content"),
            reply: false,
            retweet: false,
        }
    }
}
*/

// Alternative approach using Box<dyn Trait> for returning different types
pub fn returns_different_types_boxed(switch: bool) -> Box<dyn Summary> {
    if switch {
        Box::new(NewsArticle {
            headline: String::from("Boxed news headline"),
            content: String::from("Boxed news content"),
            author: String::from("Boxed Author"),
            location: String::from("Boxed Location"),
        })
    } else {
        Box::new(Tweet {
            username: String::from("boxed_user"),
            content: String::from("Boxed tweet content"),
            reply: false,
            retweet: false,
        })
    }
}

fn main() {
    println!("=== Demonstrating impl Trait as return type ===");

    let news = returns_news_article("Breaking: Rust traits explained!");
    println!("Returned news article: {}", news.summarize());

    let tweet = returns_tweet("rust_expert", "impl Trait is powerful but has limitations");
    println!("Returned tweet: {}", tweet.summarize());

    println!("\n=== Alternative: Using Box<dyn Trait> for different return types ===");

    let boxed_news = returns_different_types_boxed(true);
    println!("Boxed news: {}", boxed_news.summarize());

    let boxed_tweet = returns_different_types_boxed(false);
    println!("Boxed tweet: {}", boxed_tweet.summarize());

    println!("\n=== Key Points ===");
    println!("• impl Trait return type must be the same concrete type");
    println!("• Use Box<dyn Trait> if you need to return different types");
    println!("• impl Trait is more performant (no heap allocation)");
    println!("• Box<dyn Trait> is more flexible but uses dynamic dispatch");
}

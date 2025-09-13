# Rust Trait Introduction

## What is a Trait?

A Trait is like a "feature checklist" that tells the compiler what functionality a type must have. When a type implements a trait, it's like getting a "certification stamp" showing it has those capabilities.

- **Trait bounds**: When using generics, you can require that the generic type must implement certain traits
- Traits are similar to **interfaces** in other languages, but more flexible - you can add functionality to existing types

## Key Concepts

### 1. Defining a Trait

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}
```

- Use the `trait` keyword
- Contains method signatures only, no implementation
- Types implementing this trait must provide concrete implementations

### 2. Implementing Traits on Types

```rust
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
```

### 3. The Orphan Rule

**Basic Rule**: To implement a trait for a type, either the trait or the type must be defined in your project.

**What you cannot do**:

```rust
// ❌ Error: Both Vec and Display are from standard library
impl Display for Vec<i32> { ... }
```

**What you can do**:

```rust
// ✅ Correct: MyStruct is your own type
impl Display for MyStruct { ... }

// ✅ Correct: MyTrait is your own trait
impl MyTrait for Vec<i32> { ... }
```

**Why this rule exists**:

1. **Avoid conflicts**: Prevents different projects from implementing the same trait for the same type
2. **Code protection**: Ensures others' code changes won't affect your code
3. **Eliminate ambiguity**: Compiler always knows which implementation to use

## Default Implementations

### Basic Default Implementation

```rust
pub trait SummaryWithDefault {
    fn summarize(&self) -> String {
        String::from("(Read more ...)")
    }
}

// Use default implementation
impl SummaryWithDefault for NewsArticle {}
impl SummaryWithDefault for Tweet {}
```

### Default Implementation Calling Other Methods

```rust
pub trait SummaryWithAuthor {
    // Must be implemented
    fn summarize_author(&self) -> String;

    // Default implementation calling other method
    fn summarize(&self) -> String {
        format!("(Read more from {} ...)", self.summarize_author())
    }
}

impl SummaryWithAuthor for NewsArticle {
    fn summarize_author(&self) -> String {
        format!("@{}", self.author)
    }
    // Uses default implementation for summarize()
}

impl SummaryWithAuthor for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }

    // Can override default implementation
    fn summarize(&self) -> String {
        format!("Tweet by {}: {}", self.summarize_author(), self.content)
    }
}
```

**Important**: You cannot call default implementation from overriding implementation.

## Traits as Parameters

### Using `impl Trait` Syntax

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

### Using Trait Bounds

```rust
pub fn notify_bound<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

### Returning Trait Types

```rust
pub fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("system"),
        content: String::from("Generated tweet"),
        reply: false,
        retweet: false,
    }
}
```

## Handling Method Name Conflicts

When a type implements multiple traits with the same method name, you must use **fully qualified syntax**:

```rust
// Instead of: tweet.summarize() - ambiguous!
// Use explicit trait specification:

Summary::summarize(&tweet);           // Uses Summary trait
SummaryWithDefault::summarize(&tweet); // Uses SummaryWithDefault trait
SummaryWithAuthor::summarize(&tweet);  // Uses SummaryWithAuthor trait
```

## Project Structure

### File Organization

```
project/
├── Cargo.toml
└── src/
    ├── lib.rs          # Trait and struct definitions
    └── trait_1.rs      # Usage examples
```

### Cargo.toml Configuration

```toml
[package]
name = "demo"          # This determines the crate name for imports
version = "0.1.0"
edition = "2024"

[dependencies]

[[bin]]
name = "trait_1"
path = "src/trait_1.rs"
```

**Note**: The project folder name is `Trait`, but the crate name in Cargo.toml is `demo`. The crate name determines what you use in import statements.

### Import Rules

The crate name in `Cargo.toml` determines the import prefix:

```rust
// If Cargo.toml has name = "demo"
use demo::Summary;
use demo::NewsArticle;

// If Cargo.toml has name = "my_project"
use my_project::Summary;
use my_project::NewsArticle;
```

## Example Output

When running the complete example, you'll see:

```
=== Rust Trait Examples ===

1 new tweet: horse_ebooks: of course, as you probably already know, people
New article available! Penguins win the Stanley Cup Championship!, by Iceburgh (Pittsburgh, PA, USA)

--- Default Implementation ---
Article default: (Read more ...)
Tweet default: (Read more ...)

--- Default Implementation Calling Other Methods ---
Article with author: (Read more from @Iceburgh ...)
Tweet with author: Tweet by @horse_ebooks: of course, as you probably already know, people

--- Trait as Parameter ---
Breaking news! horse_ebooks: of course, as you probably already know, people
Breaking news! Penguins win the Stanley Cup Championship!, by Iceburgh (Pittsburgh, PA, USA)

--- Returning Trait Implementation ---
Generated: system: Generated tweet

--- Same Object, Different Traits ---
Basic: Penguins win the Stanley Cup Championship!, by Iceburgh (Pittsburgh, PA, USA)
Default: (Read more ...)
Author: (Read more from @Iceburgh ...)

=== Done ===
```

## Key Takeaways

1. **Traits define shared behavior** that types can implement
2. **Default implementations** reduce code duplication
3. **The orphan rule** prevents conflicts and ensures code safety
4. **Fully qualified syntax** resolves method name ambiguities
5. **Traits as parameters** enable generic programming
6. **Project structure** must align crate names with import statements

Traits are one of Rust's most powerful features, enabling safe and flexible code organization while maintaining performance and type safety.

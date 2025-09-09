# HashMap Introduction in Rust

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** September 9, 2025

## Table of Contents

1. [Overview](#overview)
2. [HashMap Characteristics](#hashmap-characteristics)
3. [Creating HashMap](#creating-hashmap)
4. [Ownership and HashMap](#ownership-and-hashmap)
5. [Accessing Values](#accessing-values)
6. [Iterating Over HashMap](#iterating-over-hashmap)
7. [Key Takeaways](#key-takeaways)
8. [Code Examples](#code-examples)

## Overview

HashMap is a collection type in Rust that stores data in key-value pairs. It uses a hash function to determine how keys and values are stored in memory, making it efficient for lookups by key rather than by index.

## HashMap Characteristics

- **Key-Value Storage**: Stores data as key-value pairs where each key maps to exactly one value
- **Hash Function**: Uses hashing to determine memory placement of keys and values
- **Heap Storage**: Data is stored on the heap rather than the stack
- **Homogeneous**: All keys must be of the same type, and all values must be of the same type
- **Not in Prelude**: Must be explicitly imported with `use std::collections::HashMap;`
- **Limited Standard Library Support**: No built-in macros for HashMap creation

## Creating HashMap

### Method 1: Using `HashMap::new()`

```rust
use std::collections::HashMap;

let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert(String::from("Hello"), 20);
```

**Note**: Type annotation is required when creating an empty HashMap, or the compiler needs to infer types from usage.

### Method 2: Using `collect()` Method

```rust
let teams = vec![String::from("Blue"), String::from("Yellow")];
let initial_scores = vec![10, 50];

let team_scores: HashMap<_, _> = teams.iter()
    .zip(initial_scores.iter())
    .collect();
```

**Process Breakdown**:

1. `iter()` creates immutable reference iterators for both vectors
2. `zip()` pairs elements from both iterators into tuples
3. `collect()` consumes the iterator and builds the HashMap

## Ownership and HashMap

HashMap handles ownership differently depending on the data type:

### For Copy Types (e.g., i32)

Values are copied into the HashMap, original variables remain accessible.

### For Owned Types (e.g., String)

```rust
let field_name = String::from("Favorite color");
let field_value = String::from("Blue");

let mut map = HashMap::new();
map.insert(field_name, field_value);
// field_name and field_value are no longer accessible - ownership moved
```

### Using References to Preserve Ownership

```rust
let color = String::from("Green");
let preference = String::from("Primary");
let mut ref_map = HashMap::new();
ref_map.insert(&color, &preference);
// color and preference remain accessible
```

**Important**: When using references, the referenced values must remain valid for the HashMap's lifetime.

## Accessing Values

Use the `get()` method to retrieve values:

```rust
let score = scores.get(&team_name);

match score {
    Some(s) => println!("Score is {}", s),
    None => println!("Team not found"),
}
```

**Key Points**:

- `get()` takes a reference to the key as parameter
- Returns `Option<&Value>` - either `Some(&value)` or `None`
- Requires proper error handling for missing keys

## Iterating Over HashMap

```rust
for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

**Note**: The iteration order is not guaranteed and may vary between runs.

## Key Takeaways

1. **When to Use HashMap**: Perfect for scenarios where you need to find data by key rather than by index
2. **Type Safety**: Rust's type system ensures all keys are the same type and all values are the same type
3. **Ownership Awareness**: Be mindful of ownership transfer when inserting owned values
4. **Error Handling**: Always handle the `Option` returned by `get()` method
5. **Performance**: O(1) average case for insertions and lookups due to hashing

## Code Examples

### Complete Working Example

```rust
use std::collections::HashMap;

fn main() {
    // Creating and populating HashMap
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    scores.insert(String::from("Red"), 25);

    // Accessing values
    let team_name = String::from("Blue");
    if let Some(score) = scores.get(&team_name) {
        println!("Team {} has score: {}", team_name, score);
    }

    // Iterating over all entries
    for (team, score) in &scores {
        println!("{}: {}", team, score);
    }
}
```

### Sample Output

![HashMap Execution Results](./img/HashMap_1_results.png)
_Screenshot showing the actual execution results of the HashMap demonstration program_

```
=== HashMap Demonstration ===

1. Creating an empty HashMap:
   Created HashMap with key 'Hello' and value 20
   HashMap: {"Hello": 20}

2. Creating HashMap using collect method:
   Teams: ["Blue", "Yellow"]
   Initial scores: [10, 50]
   Created HashMap: {"Blue": 10, "Yellow": 50}

3. HashMap and Ownership:
   HashMap after inserting owned values: {"Favorite color": "Blue"}
   Note: Original String variables can't be used after insert (ownership moved)

   Using references to preserve ownership:
   HashMap with references: {"Green": "Primary"}
   Original variables still accessible: color=Green, preference=Primary

4. Accessing HashMap values using get method:
   Looking for team 'Blue': Score is 10
   Looking for team 'Red': Team not found

5. Iterating over HashMap using for loop:
   All team scores:
   Red: 25
   Yellow: 50
   Blue: 10
```

This introduction covers the fundamental concepts of HashMap in Rust, providing both theoretical understanding and practical examples for effective usage.

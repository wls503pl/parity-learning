# Iterator

**Author:** Peile Wu  
**Contact:** peile.wu.1990@gmail.com  
**Date:** September 24, 2025

## Part 1: Iterator Trait and Next Method

### What is an Iterator?

The **Iterator Pattern** is a design pattern that allows you to perform certain tasks on each element in a series of items.

An iterator is responsible for:

- Traversing through each element
- Determining when the sequence (traversal) is complete

## Rust Iterators

Rust iterators are **lazy**: they have no effect unless you call methods that consume the iterator. In other words, if you don't use the iterator, it essentially does nothing.

### Basic Iterator Example

```rust
fn main() {
    let v1 = vec![1, 2, 3];

    // Currently v1_iter is not used, it has no iterative effect
    let v1_iter = v1.iter();

    // Each element in the iterator is used in the loop
    // Here 'val' takes ownership of v1_iter and makes it mutable internally
    for val in v1_iter {
        // The specific purpose is to print it out
        println!("Got: {}", val);
    }
}
```

## The Iterator Trait

All iterators implement the `Iterator` trait, which is defined in the standard library approximately as follows:

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // methods with default implementations elided
}
```

### Key Components

- **`type Item`** and **`Self::Item`**: Define the associated type for this trait
- **Associated Type**: When implementing the `Iterator` trait, you need to define an `Item` type, which is used as the return type for the `next` method

### The `next` Method

The `Iterator` trait requires implementing only one method: `next`.

The `next` method:

- Returns one item from the iterator each time it's called
- Wraps the return result in `Some`
- Returns `None` when iteration is complete
- Can be called directly on iterators

### Practical Example

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn iterator_demonstration() {
        let v1 = vec![5, 2, 3];

        /*
         * This iterator is modifiable, so add the mut keyword
         * Because when calling the next() method, it is equivalent to
         * changing the state of a record sequence position in the iterator
         * In other words, each call consumes an element in the iterator
         */
        let mut v1_iter = v1.iter();

        // Note: v1_iter.next() returns Option<&i32>
        assert_eq!(v1_iter.next(), Some(&5));
        assert_eq!(v1_iter.next(), Some(&2));
        assert_eq!(v1_iter.next(), Some(&3));
        assert_eq!(v1_iter.next(), None); // Iterator is exhausted
    }
}
```

## Different Iterator Methods

Rust provides several methods to create iterators with different behaviors:

### `iter()` Method

- Generates an iterator of **immutable references**
- Values obtained through `next()` calls are immutable references to vector elements
- The references are immutable, not the iterator itself

### `into_iter()` Method

- Takes **ownership** of elements during iteration
- Moves elements to a new scope and takes ownership of them

### `iter_mut()` Method

- Traverses elements using **mutable references**
- Allows modification of elements during iteration

## Key Takeaways

1. **Lazy Evaluation**: Iterators do nothing until consumed
2. **Mutability Requirement**: The iterator itself must be mutable to call `next()`
3. **State Management**: Each `next()` call changes the iterator's internal state
4. **Memory Safety**: Rust's ownership system ensures safe iteration patterns
5. **Flexibility**: Different iterator methods provide different levels of access to data

This foundation of iterator traits and the `next` method forms the basis for more advanced iterator patterns and functional programming techniques in Rust.

## Part 2: Consuming Adaptors and Iterator Adaptors

### Methods That Consume Iterators

The `Iterator` trait in the standard library provides several methods with default implementations. Some of these methods call the `next` method internally, which is why implementing the `next` method is mandatory when implementing the `Iterator` trait.

Methods that call `next` are called **"consuming adaptors"** because calling them consumes the iterator entirely.

#### The `sum` Method

The `sum` method is a prime example of a consuming adaptor that exhausts the iterator:

- Takes ownership of the iterator
- Repeatedly calls `next` to traverse all elements
- Adds each current element to a running total during iteration
- Returns the total sum when iteration ends

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn iterator_sum() {
        let v1 = vec![1, 2, 3];
        let v1_iter = v1.iter();

        let total: i32 = v1_iter.sum();
        assert_eq!(total, 6);
    }
}
```

### Methods That Produce Other Iterators

Another category of methods defined on the `Iterator` trait are called **"iterator adaptors"**. These methods transform the current iterator into different types of iterators.

You can chain multiple iterator adaptors together to perform complex operations with high readability.

#### The `map` Method

The `map` method is a common iterator adaptor that:

- Takes a closure as an argument
- Applies the closure to each element
- Produces a new iterator with transformed elements

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn iterator_adaptor() {
        let v1: Vec<i32> = vec![2, 3, 6];

        /*
         * Note: Iterators are lazy, they do nothing if nothing consumes them
         * That is, if consumable adaptor methods are not called, it will do nothing
         * Here we use the collect method as a consuming adaptor
         * Vec<_> means let the compiler infer the type inside this vector
         */
        let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
        assert_eq!(v2, vec![3, 4, 7]);
    }
}
```

#### The `collect` Method

The `collect` method is a consuming adaptor that:

- Consumes the iterator
- Collects the results into a collection type
- Is essential for materializing the results of iterator adaptors due to lazy evaluation

### Key Concepts

1. **Consuming Adaptors**: Methods like `sum` and `collect` that consume the entire iterator
2. **Iterator Adaptors**: Methods like `map` that transform iterators into new iterators
3. **Lazy Evaluation**: Iterator adaptors do nothing until consumed by a consuming adaptor
4. **Method Chaining**: Multiple iterator adaptors can be chained for complex transformations
5. **Type Inference**: Using `Vec<_>` allows the compiler to infer collection types

### Practical Applications

The combination of iterator adaptors and consuming adaptors enables functional programming patterns in Rust:

```rust
let numbers = vec![1, 2, 3, 4, 5];
let result: Vec<_> = numbers
    .iter()
    .map(|x| x * 2)           // Iterator adaptor: double each number
    .filter(|&x| x > 4)       // Iterator adaptor: keep numbers > 4
    .collect();               // Consuming adaptor: materialize results

// result = [6, 8, 10]
```

This approach provides both performance benefits through lazy evaluation and improved code readability through expressive method chaining.

## Part 3: Using Closures to Capture Environment

### The `filter` Method

The `filter` method is an iterator adaptor that demonstrates a common use case of closures capturing their environment. This method is particularly useful for conditional filtering based on external variables.

The `filter` method:

- Takes a closure as a parameter
- The closure returns a `bool` type when traversing each element of the iterator
- If the closure returns `true`: the current element will be included in the iterator produced by the `filter` method
- If the closure returns `false`: the current element will not be included in the filtered iterator

### Practical Example: Shoe Size Filtering

Here's a comprehensive example that demonstrates how closures can capture variables from their environment:

```rust
#[derive(PartialEq, Debug)]
struct Shoe {
    size: u32,
    style: String,
}

fn shoes_in_my_size(shoes: Vec<Shoe>, shoe_size: u32) -> Vec<Shoe> {
    shoes.into_iter().filter(|x| x.size == shoe_size).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn filter_by_size() {
        let shoes = vec![
            Shoe {
                size: 10,
                style: String::from("sneaker"),
            },
            Shoe {
                size: 13,
                style: String::from("sandal"),
            },
            Shoe {
                size: 10,
                style: String::from("boot"),
            },
        ];

        let in_my_size = shoes_in_my_size(shoes, 10);

        assert_eq!(
            in_my_size,
            vec![
                Shoe {
                    size: 10,
                    style: String::from("sneaker"),
                },
                Shoe {
                    size: 10,
                    style: String::from("boot"),
                },
            ]
        );
    }
}
```

### Understanding Closure Capture

In the example above, the closure `|x| x.size == shoe_size` captures the `shoe_size` parameter from its surrounding environment. This demonstrates several important concepts:

1. **Environment Capture**: The closure can access variables from its enclosing scope
2. **Immutable Borrowing**: The closure borrows `shoe_size` immutably
3. **Iterator Chaining**: Combining `into_iter()`, `filter()`, and `collect()` for data transformation
4. **Ownership**: Using `into_iter()` takes ownership of the vector elements

### Key Benefits

- **Flexibility**: Closures can capture any variable from their environment
- **Performance**: The filter operation is lazy and only processes elements when consumed
- **Readability**: The functional approach creates clear, expressive code
- **Memory Safety**: Rust's ownership system ensures safe access to captured variables

### Advanced Usage Patterns

```rust
// Capturing multiple variables
let min_size = 8;
let max_size = 12;
let medium_shoes: Vec<_> = shoes
    .into_iter()
    .filter(|shoe| shoe.size >= min_size && shoe.size <= max_size)
    .collect();

// Chaining multiple filters
let specific_shoes: Vec<_> = shoes
    .into_iter()
    .filter(|shoe| shoe.size == 10)
    .filter(|shoe| shoe.style.contains("boot"))
    .collect();
```

This part demonstrates how Rust's closures provide a powerful mechanism for creating flexible, reusable filtering logic that can adapt to different environmental conditions while maintaining memory safety and performance.

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

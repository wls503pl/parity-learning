/*
 * Add the dependent package name and its version to Cargo.toml (here we take rand as an example)
 * Cargo will download the package and its dependencies from https://crates.io/ to the local computer.
 * 'use' brings a specific entry into scope
 */
use rand::Rng;

/*
 * The standard library (std) is also treated as an external package.
 * - However, you don't need to modify 'Cargo.toml' to include the std standard library, it's built into the Rust language.
 * - You need to use the use statement to bring specific items from std into the current scope.
 */
use std::collections::HashMap;

/*
 * Use nested paths to clean up large use statements.
 * - If you're using multiple entries from the same package or module (for example),
 *   you can use nested paths to import these entries on a single line.
 * - Paths that are identical::{Paths that are different}
 * - If two use paths are a subpath of the other,
 */
use std::cmp::Ordering;
use std::io;
// Above equals to: use std::{cmp::Ordering, io};

// If you want to introduce std::io and std::io::Write (the Write Trait under std::io), then write
use std::io::{self, Write};

// Use * to bring all public items in the path into scope.
/*
 * Note that this is not usually used, it is mainly used for
 * 1. testing, importing all tested code into the tests module
 * 2. It is sometimes used in pre-import (prelude) modules
 */
use std::collections::*;

fn main() {}

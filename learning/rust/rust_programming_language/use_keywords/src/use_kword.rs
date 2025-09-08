/*
 * Common use of 'use' keyword
 *
 * For functions: Bring the function's parent module into scope (specify to parent)
 * For structs, enums, and other types: Specify the full path (specify to itself)
 */

// 'HashMap' is a struct, under the standard library 'collections'
use std::collections::HashMap;

// Entries with the same name: Assign to parent

/*
 * Use the 'Result' function in both standard library 'fmt' and the 'io' module.
 */
use std::fmt;
use std::io;

/*
 * For entries with the same name, using the 'as' keyword is also a method
 * The 'as' keyword can be used to specify a local alias for the imported path.
 */
use std::thread::Result as threadResult;

/*
 * Both Result have the same name and need to be introduced into the parent 'fmt/io'
 * The usage is the "parent module"::"entry with the same name"
 */
fn f1() -> fmt::Result {
    Ok(())
}
fn f2() -> io::Result<()> {
    Ok(())
}

fn f3() -> threadResult<()> {
    Ok(())
}

fn main() {
    // Assign to the struct itself and then use it directly
    let mut map = HashMap::new();
    map.insert(1, 2);
}

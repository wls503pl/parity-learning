/*
 * Note: The '?' operator can only be used with functions that return type Result
 * The following code reports an error:
 *
 * use std::fs::File;
 *
 * fn main()
 * {
 *     let _f = File::open("hello.txt")?;
 * }
 */

/*
 * '?' Operator and the 'main' function
 * The main function's return type is () (unit type), which is equivalent to returning nothing.
 * The main function's return type can also be Result<T, E>
 */
// The above code can be changed to:
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    // Box<dyn Error> is a trait object: it can be simply understood as any possible error type
    let _f = File::open("hello.txt")?;
    Ok(())
}

use std::fs::File;

/*
 * fn main()
 * {
 *   let f = File::open("hello.txt");
 *
 *   let f = match f {
 *       Ok(file) => file,
 *       Err(error) => {
 *           panic!("Error opening file {:?}", error);
 *       }
 *   }
 * }
 */

// The above code can be shortened to
fn main() {
    // If the result of Result is Ok, return the value in Ok; if the result of Result is Err, call the panic! macro
    // 'unwrap' cannot customize error messages
    let _f = File::open("hello.txt").unwrap();
}

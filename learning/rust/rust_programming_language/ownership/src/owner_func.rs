/*
 * Description:
 * Showing ownership and function relationships
 * Semantically, passing a value to a function is similar to assigning a value to a variable.
 * When a value is passed to a function, a move or copy occurs.
 */
fn main() {
    let s = String::from("Hello World");
    take_ownership(s);

    let x = 5;
    make_copy(x);

    println!("x: {}", x);
}

fn take_ownership(some_string: String) {
    println!("{}", some_string)
}

fn make_copy(some_number: i32) {
    println!("{}", some_number);
}

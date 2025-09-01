/*
 * Description:
 * Demonstrates the connection between ownership and return values
 * Semantically, passing a value to a function is similar to assigning a value to a variable.
 * When a value is passed to a function, a move or copy occurs.
 */
fn main() {
    let s1 = gives_ownership();

    let s2 = String::from("hello");

    let s3 = takes_and_gives_back(s2);
}

fn gives_ownership() -> String {
    let some_string = String::from("hello");
    some_string
}

/*
 * The ownership of a variable always follows the same pattern:
 * A value is moved when it is assigned to another variable.
 * When a variable containing heap data goes out of scope,
 * its value is cleared by the 'Drop' function (unless ownership of the data is transferred to another variable).
 */
fn takes_and_gives_back(a_string: String) -> String {
    a_string
}

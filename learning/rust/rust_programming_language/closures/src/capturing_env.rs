fn main() {
    // let x = 4;
    // The closure and variable x are in the same scope, and the variable x can be captured for calculation within the closure function
    // let equal_to_x = |z| z == x;
    /* fn equal_to_x(z: i32) -> bool // This will go wrong, the function cannot capture external variables
     * {
     *   z == x
     * }
     */

    // let y = 4;
    // assert!(equal_to_x(y));

    let x = vec![1, 2, 3];
    let equal_to_x = move |z| z == x;

    println!("Can't use x here: {:?}", x);

    let y = vec![1, 2, 3];
    assert!(equal_to_x(y))
}

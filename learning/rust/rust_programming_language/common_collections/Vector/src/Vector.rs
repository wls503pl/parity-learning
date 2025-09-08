fn main() {
    let v1 = vec![1, 2, 3];

    /*
     * An empty vector is created,
     * and Rust cannot automatically infer its member types.
     */
    let mut v2 = Vec::new();

    // The type of the element added here is Vector,
    // which specifies all the types(here i32) of elements it can receive.
    v2.push(1);
    v2.push(2);
    v2.push(3);

    let v3 = vec![1, 2, 3, 4, 5];
    let third: &i32 = &v3[2];
    println!("The third element is {}", third);

    match v3.get(2) {
        Some(third) => println!("The 3rd element is {}", third),
        None => println!("There is no 3rd element"),
    }
}

fn main() {
    let v1 = vec![1, 2, 3];
    // Currently v1_iter is not used, it has no iterative effect
    let v1_iter = v1.iter();

    // It is equivalent to every element in the iterator being used in the loop
    for val in v1_iter {
        // The specific purpose is to print it out
        println!("Got: {}", val);
    }
}

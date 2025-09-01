/*
 * Description:
 * Introduce and demonstrate the functionality of the clone function
 */
fn main() {
    let s1 = String::from("Hello");
    let s2 = s1.clone();

    println!("s1:{}, s2:{}", s1, s2);
}

// According to the error message
#[derive(Debug)] // Let Rectangle(struct) be derived from Debug(trait)

struct Rectangle {
    width: u32,
    length: u32,
}

fn main() {
    let rect = Rectangle {
        width: 30,
        length: 50,
    };

    /*
     * println print format method:
     * std::fmt::Display
     * std::fmt::Debug
     */
    println!("{}", area(&rect));

    // {} will report an error, {:?} will also report an error without adding debug information
    // {:#?} can make the struct print more formatted
    println!("{:#?}", rect);
}

fn area(rect: &Rectangle) -> u32 {
    rect.width * rect.length
}

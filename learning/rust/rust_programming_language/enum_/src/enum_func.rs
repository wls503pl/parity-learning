// Like structures, use 'impl' to define methods for enumerations.

enum Message {
    Quit,                    // Quit is not associated with any type of data
    Move { x: i32, y: i32 }, // Move contains an anonymous structure
    Write(String),
    ChangeColor(i32, i32, i32),
}

// Define methods for the enumeration
impl Message {
    fn call(&self) {}
}

fn main() {
    let q = Message::Quit;
    let m = Message::Move { x: 12, y: 24 };
    let w = Message::Write(String::from("Hello"));
    let c = Message::ChangeColor(0, 255, 255);

    m.call();
}

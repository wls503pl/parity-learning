enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    // By enumerating, you can put different types of data in Vector
    // Rust needs to know the type of Vector at compile time so that it knows how much memory to allocate on the heap.
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
}

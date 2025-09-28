struct CustomSmartPointer {
    data: String,
}

// No need to import drop, it is in the prelude module
impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data `{}`!", self.data);
    }
}

fn main() {
    let c = CustomSmartPointer {
        data: String::from("my stuff"),
    };

    drop(c); //  clear 'c' in advance, it's safe, won't clear 'c' twice

    let d = CustomSmartPointer {
        data: String::from("other stuff"),
    };
    println!("CustomSmartPointers created.")
}

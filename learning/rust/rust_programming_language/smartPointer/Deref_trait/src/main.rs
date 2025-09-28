use std::ops::Deref;

fn hello(name: &str) {
    println!("Hello, {}", name);
}

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

fn main() {
    let x = 5;
    // let y = &x;
    // let y = Box::new(x);
    let y = MyBox::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y); // Rust will implicitly expand *y to *(y.deref())

    let m = MyBox::new(String::from("Rust"));
    // &m type is &MyBox<String>
    // deref &MyBox<String> => String => &str
    hello(&m);
}

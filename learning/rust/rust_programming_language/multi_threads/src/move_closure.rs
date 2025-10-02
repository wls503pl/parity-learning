use std::thread;

fn main() {
    let v = vec![1, 2, 3];
    let handle = thread::spawn(move || {
        /*
         * !!! if no 'move' keyword before this closure.
         *
         * Rust infers that this code only needs a reference to v.
         * But there's a problem: the closure code might outlive v.
         */
        println!("Here's a vector: {:?}", v);
    });

    /*
     * For Example:
     * It's possible that by the time we get to this point, the sub-thread code hasn't yet executed, and 'v' has been discarded.
     * Then, 'v' in the sub-thread can't be used.
     * Therefore, the code will report an error.
     */
    // drop(v);

    handle.join().unwrap();
}

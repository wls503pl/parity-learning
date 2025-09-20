use minigrep::Config;
use std::env;
use std::process;

fn main() {
    /*
     * args() returns an iterator that produces a series of values.
     * You can then call the 'collect()' method on the iterator to convert this series of values ​​into a collection,
     * however, 'collect()' cannot infer what type of collection it is, so the type of collection must be specified after the variable.
     * such as a vector.
     *
     * Notice:
     * 'env::args()' cannot handle illegal Unicode characters. If the command line parameters contain illegal Unicode characters,
     * the program will panic. If you need to receive parameters containing illegal Unicode characters in your program,
     * you must use 'env::args_os()'. The iterator it returns produces values ​​of type 'OsString'.
     * This program is relatively simple here, so we will not consider this case.
     */
    let args: Vec<String> = env::args().collect();

    /*
     * Add some processing to the 'new' function to make the generated error message more friendly if an error occurs
     * 'unwrap_or_else' is defined on the 'Result' enumeration. The principle is that if the value of the previous Result is Ok,
     * it acts like the 'unwrap' method, extracting the value in 'Ok' and returning it.
     * If the previous Result returns 'Err', 'unwrap_or_else' will call a closure
     * (a defined anonymous function: |err| is equivalent to the function's parameter, followed by the function body)
     */
    let config = Config::new(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {}", err);
        /*
         * Call process::exit(1); The program execution will be terminated immediately, and the parameter '1' is the status code of the program exit
         * This error is handled in this way. The only error message is the one above, and then the program exits.
         */
        process::exit(1);
    });

    if let Err(e) = minigrep::run(config) {
        println!("Application error: {}", e);
        process::exit(1);
    }
}

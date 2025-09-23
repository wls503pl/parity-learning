use std::thread;
use std::time::Duration;

fn main() {
    let simulated_user_specified_value = 10;
    let simulated_random_number = 7;

    generate_workout(simulated_user_specified_value, simulated_random_number);
}

fn simulated_expensive_calculation(intensity: u32) -> u32 {
    println!("calculating slowly ...");
    thread::sleep(Duration::from_secs(2));
    intensity
}

fn generate_workout(intensity: u32, random_number: u32) {
    /*
     * Parameters are placed between two |,
     * If there are multiple parameters between parameters, use , to separate them, such as |num1, num2|
     *
     * Note:
     * Here we just put the definition of an anonymous function in a closure variable, not the function return value.
     * And this is a statement and needs to end with ;
     */
    let expensive_closure = |num| {
        println!("calculating slowly ...");
        thread::sleep(Duration::from_secs(2));
        num
    };

    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            // simulated_expensive_calculation(intensity)
            // call closure
            expensive_closure(intensity)
        );

        println!(
            "Next, do {} situps!",
            // simulated_expensive_calculation(intensity)
            expensive_closure(intensity)
        );
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!(
                "Today, run for {} minutes!",
                // simulated_expensive_calculation(intensity)
                expensive_closure(intensity)
            );
        }
    }
}

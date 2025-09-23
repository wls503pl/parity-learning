use std::thread;
use std::time::Duration;

struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calculation: T, // closure

    /*
     * The value to be cached is None before running the closure.
     * After running the closure, the result of the closure operation will be stored in the value field.
     * If you request the closure result again in the future, you can directly get the value of value as soon as you see that value has a value.
     */
    value: Option<u32>,
}

impl<T> Cacher<T>
where
    T: Fn(u32) -> u32,
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: None,
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value {
            Some(v) => v, // If the value field has a value, return the value
            None => {
                // If the value of value is None, call the closure,
                // encapsulate the result into Some and assign it to value and return the running result
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            }
        }
    }
}

fn main() {
    let simulated_user_specified_value = 12;
    let simulated_random_number = 6;

    generate_workout(simulated_user_specified_value, simulated_random_number);
}

/*
 * fn simulated_expensive_calculation(intensity: u32) -> u32 {
 *   println!("calculating slowly ...");
 *   thread::sleep(Duration::from_secs(2));
 *   intensity
 *}
 */

fn generate_workout(intensity: u32, random_number: u32) {
    /*
     * Parameters are placed between two |,
     * If there are multiple parameters between parameters, use , to separate them, such as |num1, num2|
     *
     * Note:
     * Here we just put the definition of an anonymous function in a closure variable, not the function return value.
     * And this is a statement and needs to end with ;
     */
    let mut expensive_closure = Cacher::new(|num| {
        println!("calculating slowly ...");
        thread::sleep(Duration::from_secs(2));
        num
    });

    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            // simulated_expensive_calculation(intensity)
            // call closure in struct, only run once could get value.
            expensive_closure.value(intensity)
        );

        println!(
            "Next, do {} situps!",
            // simulated_expensive_calculation(intensity)
            expensive_closure.value(intensity)
        );
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!(
                "Today, run for {} minutes!",
                // simulated_expensive_calculation(intensity)
                expensive_closure.value(intensity)
            );
        }
    }
}

use std::iter::Iterator;

struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}

// 自定义一个 Iterator for 结构体 Counter
impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

#[test]
fn calling_next_directly() {
    let mut counter = Counter::new();

    assert_eq!(counter.next(), Some(1));
    assert_eq!(counter.next(), Some(2));
    assert_eq!(counter.next(), Some(3));
    assert_eq!(counter.next(), Some(4));
    assert_eq!(counter.next(), Some(5));
    assert_eq!(counter.next(), None);
}

#[test]
fn using_other_iterator_trait_methods() {
    let sum: u32 = Counter::new()
        /*
         * 'zip' method takes two iterators and links each pair of elements given to it (one from each iterator) together to form a tuple.
         * The first is an iterator for Counter([1,2,3,4,5], where 5 is added to the previous value). The second iterator skips the first element,
         * which means it omits the first element from the existing Counter iterator, which is [2,3,4,5].
         * After 'zip' ([1,2,3,4,5], [2,3,4,5]), we get [2,6,12,20] through the closure algorithm of 'map',
         * then we get [6, 12] through the judgment of whether it is divisible by 3 through 'filter',
         * finally we get the sum through sum, which is 18.
         */
        .zip(Counter::new().skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 3 == 0)
        .sum();

    assert_eq!(18, sum);
}

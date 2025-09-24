#[cfg(test)]
mod tests {
    #[test]
    fn iterator_demonstration() {
        let v1 = vec![5, 2, 3];

        /*
         * This iterator is modifiable, so add the mut keyword
         * Because when calling the next() method, it is equivalent to changing the state of a record sequence position in the iterator
         * In other words, each call consumes an element in the iterator
         */
        let mut v1_iter = v1.iter();

        // Note: v1_iter.next() returns Option<&i32>
        assert_eq!(v1_iter.next(), Some(&5));
        assert_eq!(v1_iter.next(), Some(&2));
        assert_eq!(v1_iter.next(), Some(&3));

        /*
         * Note: Iterators are lazy, they do nothing if nothing is consumed
         * That is, if the consumable adapter method is not called, it will do nothing. Here, the collect method is used.
         * Vec<_> means let the compiler infer the type of this vector
         */
        let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
        assert_eq!(v2, vec![6, 3, 4]);
    }
}

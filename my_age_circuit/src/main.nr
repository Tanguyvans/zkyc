fn main(age: u8, min_age: pub u8) {
    // Private input: actual age
    // Public input: minimum age requirement (18)
    // The circuit will fail if age < min_age

    // Assert that the age is at least the minimum age
    assert(age >= min_age);
}

# Age Verification ZK Circuit

This is a simple zero-knowledge circuit built with Noir that proves you are older than 18 without revealing your actual age.

## How it works

- **Private input**: Your actual age (kept secret)
- **Public input**: Minimum age requirement (18)
- **Behavior**: Circuit executes successfully if age >= 18, fails if age < 18

## Files

- `Nargo.toml`: Project configuration
- `src/main.nr`: Circuit logic
- `Prover.toml`: Input values for testing

## Usage

1. **Set your actual age** in `Prover.toml`:

   ```toml
   age = "25"  # Replace with your actual age
   ```

2. **Compile the circuit**:

   ```bash
   nargo compile
   ```

3. **Execute the circuit**:
   ```bash
   nargo execute
   ```

## Test Results

- **Age >= 18**: Circuit executes successfully, witness saved
- **Age < 18**: Circuit fails with "Failed constraint" error

## Security Note

The circuit will fail (not generate a witness) if your age is less than 18. A successful execution demonstrates you are at least 18 years old without revealing your exact age.

## Example Output

```bash
# With age = 25
$ nargo execute
[age_verification] Circuit witness successfully solved
[age_verification] Witness saved to target/age_verification.gz

# With age = 17
$ nargo execute
error: Failed constraint
Failed to solve program: 'Cannot satisfy constraint'
```

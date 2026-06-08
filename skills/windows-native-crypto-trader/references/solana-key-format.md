# Solana key format and wallet handling

- Validator keypairs on Solana are usually **ed25519 32-byte seeds**.
- Phantom import expects **base58 of the raw 32-byte secret key**.
- Herens-aware conversion:
  ```python
  import base58
  secret_bytes = bytes(seed_list)  # list[int]
  phantom_import = base58.b58encode(secret_bytes).decode()
  ```
- Never write `wallet.json` or private material into the Git repo.

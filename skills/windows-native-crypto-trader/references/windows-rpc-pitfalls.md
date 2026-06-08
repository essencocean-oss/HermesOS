# Windows RPC / Crypto pitfalls

- PowerShell quoting breaks when passing hex or `0x` prefixed args. Wrap quoted args in **single quotes**, not double quotes.
- Prefer `python` over `python3` on Windows; verify with `where python`.
- Solana CLI on Windows installs to:
  `C:\Users\<USER>\.local\share\solana\install\active_release\bin\solana.exe`
  If not on PATH, call it via the full path.
- JSON-RPC `requestAirdrop` may return `-32603`. Retry up to 3 times with 1-second delay.
- Do not rely on `web3` without first checking `pip install web3` on the local Python.
- Wallet files generated via `solana-keygen` are **not** Phantom-compatible by default: convert to base58 raw 32-byte seed for Phantom import.

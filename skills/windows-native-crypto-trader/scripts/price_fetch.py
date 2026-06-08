import sys

CMD = sys.argv[1] if len(sys.argv) > 1 else "price"
ARG = sys.argv[2] if len(sys.argv) > 2 else "SOL"


def make_rpc_call(url, payload):
    import urllib.request, json
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read())


def get_sol_price():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    data = make_rpc_call(url, {})
    price = data.get("solana", {}).get("usd")
    print({"symbol": "SOL", "usd": price})
    return price


def get_wallet_balance(address: str):
    rpc = "https://api.mainnet-beta.solana.com"
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address],
    }
    data = make_rpc_call(rpc, payload)
    lamports = data.get("result", {}).get("value", 0)
    sol = lamports / 1_000_000_000
    print({"address": address, "lamports": lamports, "sol": sol})
    return sol


if CMD == "price":
    get_sol_price()
elif CMD == "wallet":
    get_wallet_balance(address=ARG)
else:
    raise SystemExit(f"Unknown command: {CMD!r}")

# Oasis

1. The telegram demo is very good as a starting point. to get the hang of it.
2. Idk if you guys mention somewhere that we need to ask for a port to be manually open.
3. I tried to run https://github.com/oasisprotocol/demo-rofl-chatbot on localnet but I could not connect my wallet. I followed the instructions

```bash
inpage.js:1 MetaMask - RPC Error: Internal JSON-RPC error.
Object
code
:
-32603
data
:
{code: -32000, message: 'rpc error: code = Unavailable desc = connection er…ent-0/internal.sock: connect: connection refused"', cause: null}
message
:
"Internal JSON-RPC error."
stack
:
"{\n  \"code\": -32603,\n  \"message\": \"Internal JSON-RPC error.\",\n  \"data\": {\n    \"code\": -32000,\n    \"message\": \"rpc error: code = Unavailable desc = connection error: desc = \\\"transport: Error while dialing: dial unix /serverdir/node/net-runner/network/client-0/internal.sock: connect: connection refused\\\"\",\n    \"cause\": null\n  },\n  \"stack\": \"Error: Internal JSON-RPC error.\\n    at new o (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:3:5787)\\n    at i (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:3:8878)\\n    at Object.internal (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:3:9487)\\n    at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:3:405819\\n    at async chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:9:62927\"\n}\n  at new o (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:3:5787)\n  at i (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:3:8878)\n  at Object.internal (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:3:9487)\n  at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:3:405819\n  at async chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:9:62927"
[[Prototype]]
:
Object
```

I think the error is from when you ask to add the network (localnet) to the wallet and then put wrong values.

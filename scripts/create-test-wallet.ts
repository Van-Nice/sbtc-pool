import * as bip39 from "bip39";
import * as bip32 from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import { getAddressFromPrivateKey } from "@stacks/transactions";
import * as tinySecp from "@bitcoin-js/tiny-secp256k1-asmjs";

bitcoin.initEccLib(tinySecp);
const BIP32Factory = bip32.default(tinySecp);

async function main() {
  // Use the same mnemonic as in the TOML
  const mnemonic =
    "shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform";

  // Derive Bitcoin address
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = BIP32Factory.fromSeed(seed, bitcoin.networks.regtest);

  // Derive Bitcoin address (m/44'/0'/0'/0/0)
  const btcChild = root.derivePath("m/44'/0'/0'/0/0");
  const btcAddress = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(btcChild.publicKey),
    network: bitcoin.networks.regtest,
  }).address!;

  // Derive Stacks address (m/44'/5757'/0'/0/0)
  const stxChild = root.derivePath("m/44'/5757'/0'/0/0");
  if (!stxChild.privateKey) throw new Error("Failed to derive private key");
  const stxPrivateKey = Buffer.from(stxChild.privateKey).toString("hex");
  const stacksAddress = getAddressFromPrivateKey(
    stxPrivateKey,
    "testnet" // Use testnet version for devnet
  );

  console.log("Bitcoin Address:", btcAddress);
  console.log(
    "Bitcoin Private Key:",
    Buffer.from(btcChild.privateKey!).toString("hex")
  );
  console.log("Stacks Address:", stacksAddress);
  console.log("Stacks Private Key:", stxPrivateKey);
}

main().catch(console.error);

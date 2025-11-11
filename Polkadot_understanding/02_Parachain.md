# Polkadot Cross-Chain Protocol: Parachain Phase

**Author:** Peile Wu  
**Email:** peile.wu.1990@gmail.com  
**Date:** November 9, 2025

---

## Network Architecture

![Collator Ferry](./img/02_Parachain/parachain_structure.png)

- Collators are independent programs joining both Parachain and Relaychain P2P networks;
- Collators ferry information from Parachain to Relaychain as intermediate nodes

---

## Overall Process

![Candidate Flow](./img/02_Parachain/parachain_overall_process.png)

- The parallel chain phase refers to the collator of the parallel chain proposing a candidate block to a group of validators currently assigned to that parallel chain.
- Collator nodes are active on a unique parallel chain, submitting state transition proposals and their validity proofs.
- A candidate block is a new block proposed by the collator of the parallel chain; it may be valid or invalid.
- Before being incorporated into the relay chain, it must undergo validity checks by the relay chain's validators.

---

## Collator Incentives

- Parachain only needs one honest collator to submit blocks
- From Relaychain perspective, collators don't need to stake DOTs
- Collators as collators have no rewards
- Economic rewards for collators (if any) need to be implemented on the Parachain
- Collators can also act as fishermen, which can provide corresponding rewards

---

## Testing Method & Code understanding

To be done.

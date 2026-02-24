# FightChub — TODO

## ✅ Done

### Core Game
- [x] Battle engine ported to TypeScript (backend/lib/battle-engine/)
- [x] /api/battle/run endpoint (Next.js, Vercel) — x-sync-secret header, anti-replay UNIQUE(player_id, seed)
- [x] Server battle integration in frontend (startServerBattle, animateBattleFromLog)
- [x] Game is online-only — requires Privy login (playerSession) to battle
- [x] Chest system — battle chests (pendingVictoryChests array) + fragment chests, 5 tiers
- [x] Skill tree — 8 branches × 7 nodes, path/cross-node locks, Champion prestige branch
- [x] Consumables — 8 items, equip 2 for battle, server-side trigger logic
- [x] Weapon system — PNG sprites, 13 tiers (tier_5 → tier_100), weapon-run overlay
- [x] Sprite layer system — Blob URLs, hue-shift, composited skins
- [x] Daily claim — 30-day rewards, persist via localStorage
- [x] XP boost system — pendingXpBoosts (max 3), manual activate
- [x] Deployed: joshuadevmode.github.io/FightChub/ + fight-chub-backend.vercel.app

### Backend APIs (all on fight-chub-backend / Vercel)
- [x] POST /api/battle/run
- [x] POST /api/aon/start — deducts tokens, creates/resumes aon_matches row
- [x] POST /api/matchmaking/join — P2 runs battle immediately (short polling, ±3 level range)
- [x] GET  /api/matchmaking/status — P1 polls; flipped event log + rewards
- [x] POST /api/matchmaking/cancel
- [x] POST /api/economy/spend — server-side price validation
- [x] POST /api/character/sync
- [x] POST /api/player/sync
- [x] backend/lib/pack-char.ts — packs DB character into on-chain BattleTypes.Character
- [x] backend/pages/api/aon/sign-character.ts — EIP-191 char sig for AoNEscrow (viem)
- [x] backend/pages/api/aon/sign-character-solana.ts — ed25519 char sig for Solana program (tweetnacl)

### Frontend On-Chain (Monad / EVM)
- [x] ethers.js v6 via CDN; MONAD_CHAIN_ID = 10143
- [x] packCharForContract() / packSkillsForContract()
- [x] aonStartMatchmakingOnChain(), aonCreateRoomOnChain(), aonJoinRoomOnChain(), aonWaitForResult()
- [x] aonStartMatchmaking() routing: Solana → Monad → off-chain CPU fallback

### Frontend On-Chain (Solana)
- [x] @solana/web3.js v1 CDN
- [x] _canonicalCharBytesForSolana(), _anchorDiscriminator(), _borshEncodeCharData()
- [x] _buildCreateRoomIxData(), _aonWaitForResultSolana(), aonStartMatchmakingSolana()

### Smart Contracts — Monad (Foundry, compiles clean)
- [x] ChubToken.sol (ERC-20, non-transferable; symbol CHUB; reward() + spend())
- [x] BattleEngine.sol + BattleTypes/RNG/Constants/SkillsLib — full Solidity port of battle engine
- [x] AoNEscrow.sol — Pyth Entropy VRF, trusted relayer sig, burn-on-enter/mint-on-exit
- [x] DeployAoN.s.sol deploy script

### Smart Contracts — Solana (Anchor 0.31, code complete)
- [x] chub-token program (spend + reward CPIs)
- [x] fightchub-aon program — 8 instructions (initialize, create_room, join_room, consume_randomness, cancel_room, refund_entropy_stuck, claim_held_payout, admin)
- [x] Rust battle engine port (rng.rs / engine.rs / skills.rs / constants.rs)
- [x] Ed25519 char sig verification via Instructions sysvar precompile
- [x] **Switchboard Classic VRF** migration (replaced Pyth Entropy — Pyth is EVM-only)
  - Config: switchboard_program replaces pyth_entropy + pyth_provider
  - Room: vrf_account (Pubkey) replaces entropy_sequence (u64)
  - join_room: 12 Switchboard VRF accounts; cpi::request_randomness
  - consume_randomness: reads result from vrf.load()?.get_result()

---

## 🚀 Deploy (highest priority)

### Monad Testnet
- [ ] Get Monad testnet RPC URL + faucet MON
- [ ] Look up Pyth Entropy address on Monad testnet
- [ ] Generate CHARACTER_SIGNER wallet (EVM keypair) — export private key → CHARACTER_SIGNER_KEY
- [ ] Generate RELAYER wallet (EVM keypair) → fund with MON (calls resolveMatch on AoNEscrow)
- [ ] Set Foundry env vars: PRIVATE_KEY, PYTH_ENTROPY_ADDRESS, PYTH_PROVIDER_ADDRESS, RELAYER_ADDRESS, CHARACTER_SIGNER_KEY
- [ ] `forge script script/DeployAoN.s.sol --broadcast` (deploys ChubToken + AoNEscrow)
- [ ] Fill AON_ESCROW_ADDRESS + CHUB_TOKEN_ADDRESS constants in index.html
- [ ] Call setAuthorized(escrow, true) on ChubToken (done in deploy script — verify it ran)

### Solana Devnet
- [ ] `anchor build` in contracts/solana-aon/ — verify clean compile with Switchboard crate
  - If anchor version conflict: add `[patch.crates-io]` pinning anchor-lang = "0.31.0"
- [ ] `anchor deploy --provider.cluster devnet`
- [ ] Fill FIGHTCHUB_AON_SOLANA_PROGRAM_ID in index.html
- [ ] Fill create_room + join_room account metas in frontend from generated IDL
- [ ] Generate CHARACTER_SIGNER_SOLANA keypair (`solana-keygen new`) → export as base58
- [ ] Set env var CHARACTER_SIGNER_SOLANA_KEY in Vercel (base58, 64-byte keypair)

---

## 🔧 Backend / Infrastructure

### Supabase
- [ ] Run supabase/schema.sql — tables: characters, battle_results, skin_templates, skin_mints
- [ ] Run backend/supabase/matchmaking_schema.sql — matches table + find_or_create_match RPC
- [ ] Run migration: `ALTER TABLE battle_results ADD CONSTRAINT battle_results_player_seed_unique UNIQUE (player_id, seed);`
- [ ] Verify Vercel env vars:
      NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SYNC_SECRET
      CHARACTER_SIGNER_KEY (0x… EVM private key — used by sign-character.ts)
      CHARACTER_SIGNER_SOLANA_KEY (base58 64-byte keypair — used by sign-character-solana.ts)
- [ ] Create Supabase Storage bucket "skins"

### Missing Endpoints
- [ ] POST /api/aon/room/open — P1 registers roomId so P2 can discover it (needed for on-chain Solana AoN P2 flow)
- [ ] Add rate limiting to /api/battle/run (1 battle / 5s per playerId)
- [ ] Wire consumable deduction: after battle returns, deduct used consumables from character in DB

---

## 💎 Smart Contracts — Remaining

### Monad
- [ ] Add MON → CHUB buy function to ChubToken (payable, sets exchange rate)
- [ ] ERC-721 character NFT contract (mintable at level threshold)
- [ ] ERC-6551 token-bound accounts (character NFT owns its skin NFTs)
- [ ] /api/character/mint endpoint (verifies level, calls contract)
- [ ] /api/character/[id]/metadata dynamic metadata endpoint

### Solana
- [ ] Update frontend join_room call: remove user_commitment param, add 12 Switchboard VRF accounts
  - P2 flow: VrfLite.create() → fund escrow (~0.002 SOL) → join_room (batch in sendAll)
- [ ] fightchub-nft Metaplex program — character NFT + mutable metadata
- [ ] Wormhole NTT setup for CHUB token bridging Monad ↔ Solana

---

## 🌐 Frontend

- [ ] Show on-chain CHUB balance in lobby currency bar (once Monad contracts deployed)
- [ ] "Mint Skin NFT" button in inventory (call ERC-721 contract)
- [ ] Show owned skin NFTs from wallet (read from contract)
- [ ] Equip skin from NFT (set character.appearance from on-chain metadata)
- [ ] Call /api/character/sync after level-up, stat changes, skin equip (verify wired correctly)

---

## 🔍 Nice to Have

- [ ] Battle replay (store event log, let player replay past fights)
- [ ] Leaderboard page (query battle_results by win count)
- [ ] Push notifications for chest unlock ready
- [ ] Mobile layout polish
- [ ] New skill branch (effect TBD)

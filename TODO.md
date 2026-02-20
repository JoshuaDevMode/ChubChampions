# FightChub — TODO

## ✅ Done
- [x] Battle engine ported to TypeScript (backend/lib/battle-engine/)
- [x] /api/battle/run endpoint (Next.js, Vercel) — accepts player + cpu, returns event log
- [x] CORS headers in next.config.js
- [x] Server battle integration in frontend (startServerBattle, animateBattleFromLog)
- [x] Game is online-only — requires Privy login to play
- [x] Removed 1,668 lines of local battle logic from frontend
- [x] Renamed Index.html → index.html for GitHub Pages
- [x] Game deployed: joshuadevmode.github.io/FightChub/
- [x] Logout fixed (no more auto-redirect to Privy)

---

## 🔧 Backend / Infrastructure

### Supabase
- [ ] Run supabase/schema.sql in Supabase SQL Editor
      Tables: skin_templates, skin_mints, characters, battle_results
- [ ] Verify Vercel env vars are set:
      NEXT_PUBLIC_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY
      SUPABASE_SERVICE_ROLE_KEY
      SYNC_SECRET
- [ ] Set up Supabase Storage bucket for skin images (named "skins")
- [ ] Replace placeholder image URLs in schema.sql with real Supabase Storage URLs

### Battle API
- [ ] Test /api/battle/run end-to-end with a real browser session
- [ ] Add rate limiting to prevent API abuse (e.g. 1 battle/5 sec per playerId)
- [ ] Wire consumable usage: deduct used consumables from character after battle result returns

---

## 💎 Smart Contracts (Monad — do first)

### FCHUB Token (ERC-20)
- [ ] Write token contract (non-transferable between wallets, mintable by game)
- [ ] Deploy to Monad testnet
- [ ] Add buy function (pay MON → receive FCHUB)
- [ ] Integrate in frontend: show FCHUB balance in lobby currency bar

### AoN Escrow Contract
- [ ] Write escrow contract (both players deposit, winner gets both)
- [ ] Deploy to Monad testnet
- [ ] Connect to AoN mode: entry fee locked on-chain, payout on result

### Character NFT (ERC-721 + ERC-6551)
- [ ] Write ERC-721 character contract
- [ ] Add ERC-6551 token-bound accounts (each character NFT owns its skins)
- [ ] Mint endpoint: /api/character/mint (requires level threshold)
- [ ] Dynamic metadata endpoint: /api/character/[id]/metadata

---

## 🌐 Frontend / Game

### Wallet Connect
- [ ] Add wallet connect button to lobby (MetaMask/Rabby via wagmi or viem)
- [ ] Show FCHUB balance next to token counter in currency bar
- [ ] Link wallet address to playerSession

### Character Sync to Backend
- [ ] Call /api/character/sync after level-up, stat changes, skin equip
- [ ] Show character data on the characters table in Supabase

### Skin NFT Flow
- [ ] "Mint Skin" button in inventory when player owns a skin
- [ ] Show owned NFT skins from wallet (read from contract)
- [ ] Equip skin from NFT (set character.appearance from on-chain data)

### PvP Matchmaking
- [ ] Real-time matchmaking (WebSocket or Supabase Realtime)
- [ ] Both players send character data → server picks seed → battle runs → result broadcast
- [ ] AoN mode: both must sign escrow tx before match starts

---

## 🔗 Cross-chain (Solana — later)

- [ ] Wormhole NTT setup for FCHUB token on Solana
- [ ] Metaplex character NFTs on Solana
- [ ] Wormhole message passing for cross-chain match results

---

## 🔍 Nice to Have (polish)

- [ ] Battle replay feature (store event log, let player replay past battles)
- [ ] Leaderboard page (query battle_results by win count)
- [ ] Push notifications for chest unlock ready
- [ ] Mobile layout polish
- [ ] Add new skill to skill tree (branch/effect TBD by user)

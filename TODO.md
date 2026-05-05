# Chub Champions — TODO

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
- [x] Deployed: joshuadevmode.github.io/ChubChampions/ + chub-champions-backend.vercel.app

### UI / UX (2025-02-24)
- [x] Lobby, AoN panel y stats: mejoras visuales generales de CSS
- [x] XP bar rediseñada — barra gold gradient + círculo de nivel + texto "current / max"
- [x] Notificaciones (campana) — badge, dropdown, colores por tipo (arma, nivel, cofre, PvP)
- [x] Árbol de habilidades — panel izquierdo con 14 combat stats derivados (crit, dodge, lifesteal…)
  agrupados en OFFENSE / DEFENSE / STATUS, todos visibles aunque sean 0%
- [x] Árbol de habilidades — nodos cuadrados (8px radius), badge de rank debajo del icono,
  conectores en naranja estilo Mu Online, tooltips con hover
- [x] Session widget — botón LOGOUT reemplazado por dropdown al hacer click (chevron ▾ + DISCONNECT)
- [x] Balance de wallet en currency bar — detecta Solana (◎ SOL, teal) vs Monad (⬡ MON, violeta)
  según formato de dirección; click para refrescar
- [x] Fix: cofres no se podían abrir — syncStateFromServer ahora siempre respeta el servidor
  (antes ignoraba array vacío); start_chest_unlock ya no es fire-and-forget

### Battle Visual Fixes (2026-05-05)
- [x] Bat: agregado `heavyAttack: true` para que use animación 2-manos del personaje
  (antes usaba la de 1 mano)
- [x] Winner frame no se veía — `showGameOver` no limpiaba todos los overlays de ataque
  (`heavy-attack-char-overlay`, `weapon-attack-overlay`, `weapon-attack-char-overlay`).
  Ahora limpia en ambas ramas (AoN + normal) y resetea `visibility` del jaImg
- [x] Hit FX aparecía "atrás" del oponente — antes usaba el centro del defensor.
  Ahora se calcula como `defCx*0.75 + atkCx*0.25` para que aparezca DENTRO del cuerpo
  del defensor cerca del lado donde el atacante hace contacto (showBloodEffect + jump shockwave)
- [x] Defensor quedaba desfasado tras un jump attack causando que ataques posteriores
  no conectaran visualmente — agregado snap defensivo del defender a su `_homeX` al final
  de cada ataque (línea ~22760)
- [x] Weapon-run-overlay re-habilitado: antes hardcoded a `[]` por bug de desync.
  Ahora carga frames del cache `_weaponRunFramesCache[wepId]` y oculta idle overlay
  durante la corrida para evitar arma duplicada
- [x] Arma desaparecía al volver del attack run + flip de facing — `stopRunAnimation`
  ahora restaura inmediatamente el `weapon-idle-overlay` cuando armado, y
  `_syncFacingDirection` limpia el flag `_hiddenByAnimation` del idle overlay si no
  hay otros overlays activos
- [x] `_ATCK_GAP` recalibrado para que los blobs visibles se toquen al impactar
  (los sprites son ~150-200px dentro del container de 220px):
  unarmed=50, weapon=70, heavy=100, long-reach=100. Antes era 100/150/180/230
- [x] Jump/hop landing gap unificado: unarmed=50, long-reach=100 (antes había gap heavy
  que causaba landing demasiado atrás)
- [x] `taking-damage` keyframe ahora retorna a `translate(0)` al 100% en vez de quedar
  en 22px — eliminaba residuo de pushback que afectaba la posición visual del defensor
  en el siguiente ataque
- [x] Reset defensivo de transforms al inicio de cada ataque — limpia `attackerEl`,
  `defenderEl`, sus `.fighter-body` y `img.character-png` para que cada ataque empiece
  desde un estado visual idéntico (skip si `_hurtActive`)
- [x] Diagnóstico runtime: `window.__diagAlign = true` en consola activa logs
  `[align][attack-start]`, `[align][jump-landed]`, `[align][attack-end]` con
  posiciones server vs visual, útil para debugear desfases

### Backend APIs (all on chub-champions-backend / Vercel)
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
- [x] chub-aon program — 8 instructions (initialize, create_room, join_room, consume_randomness, cancel_room, refund_entropy_stuck, claim_held_payout, admin)
- [x] Rust battle engine port (rng.rs / engine.rs / skills.rs / constants.rs)
- [x] Ed25519 char sig verification via Instructions sysvar precompile
- [x] **Switchboard Classic VRF** migration (replaced Pyth Entropy — Pyth is EVM-only)
  - Config: switchboard_program replaces pyth_entropy + pyth_provider
  - Room: vrf_account (Pubkey) replaces entropy_sequence (u64)
  - join_room: 12 Switchboard VRF accounts; cpi::request_randomness
  - consume_randomness: reads result from vrf.load()?.get_result()

---

## 🔴 CRÍTICO — Antes de lanzar compra de tokens

- [x] **Migrar autenticación de endpoints de `SYNC_SECRET` a JWT de Privy** ✅ Done
  - `backend/lib/privy-server.ts` — singleton PrivyClient
  - `backend/lib/verify-privy.ts` — verifyRequest() helper (Privy JWT or SYNC_SECRET fallback)
  - Endpoints migrados: economy/spend, character/feed, character/boost, aon/start
  - Frontend: getAuthHeaders() helper, token stored in playerSession, 401 → redirect to login
  - `pages/index.tsx` → getAccessToken() and pass token in redirect URL params
  - **Requires new Vercel env var: `PRIVY_APP_SECRET`** (get from Privy dashboard → Settings → API Keys)

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
- [ ] Fill CHUB_AON_SOLANA_PROGRAM_ID in index.html
- [ ] Fill create_room + join_room account metas in frontend from generated IDL
- [ ] Generate CHARACTER_SIGNER_SOLANA keypair (`solana-keygen new`) → export as base58
- [ ] Set env var CHARACTER_SIGNER_SOLANA_KEY in Vercel (base58, 64-byte keypair)

### Wormhole Cross-Chain + Relay
- [ ] Look up Wormhole chain ID for Monad (from Wormhole governance)
- [ ] Look up Wormhole Core Bridge addresses (Solana devnet + Monad testnet)
- [ ] Install backend deps: `npm install @solana/web3.js @solana/spl-token @certusone/wormhole-sdk`
- [ ] Generate RELAYER wallet for Solana (`solana-keygen new`) → fund with devnet SOL
- [ ] Set Vercel env vars:
  - `RELAYER_PRIVATE_KEY` — EVM hex key (Monad relay txs)
  - `RELAYER_PRIVATE_KEY_SOLANA` — base58 key (Solana relay txs)
  - `AON_ESCROW_MONAD` — deployed AoNEscrow address on Monad
  - `AON_PROGRAM_ID_SOLANA` — deployed program ID on Solana
  - `WORMHOLE_CHAIN_ID_MONAD` — Wormhole chain ID for Monad
  - `WORMHOLE_API_URL` — `https://api.testnet.wormholescan.io`
  - `WORMHOLE_PROGRAM_SOLANA` — Core Bridge program ID on Solana devnet
- [ ] Initialize Solana program: call `initialize` with Wormhole config (monad_emitter, chain_id, wormhole_program)
- [ ] Initialize Monad contract: set `trustedSolanaEmitter` + `solanaChainId` in constructor
- [x] Frontend: cross-chain join routing in `aonAcceptChallenge()` — detects P2 chain vs room chain
- [x] Frontend: `aonJoinCrossChainFromMonad()` — Monad P2 → Solana room (joinCrossChain + relay)
- [x] Frontend: `aonJoinSameChainMonad()` — Monad P2 → Monad room (joinRoom + wait)
- [ ] Frontend: `aonJoinCrossChainFromSolana()` — Solana P2 → Monad room (needs deployed program)
- [x] Backend: lobby returns `onChainRoomId` for cross-chain join routing
- [x] Frontend: `joinCrossChain` added to AON_ESCROW_ABI
- [ ] Test cross-chain flow: Solana P2 → Monad room → relay CROSS_JOIN → resolve → relay BATTLE_RESULT
- [ ] Test cross-chain flow: Monad P2 → Solana room → relay CROSS_JOIN → resolve → relay BATTLE_RESULT

---

## 🔧 Backend / Infrastructure

### Supabase
- [x] supabase/schema.sql — archivo completo (characters, battle_results, skin_templates, skin_mints, vault_deposits, aon_matches). **Ejecutar en Supabase SQL Editor si no se ha corrido aún.**
- [x] backend/supabase/matchmaking_schema.sql — tabla matches + find_or_create_match RPC. **Ejecutar si no se ha corrido.**
- [x] `battle_results_player_seed_unique` — incluido en schema.sql
- [x] `win_streak`, `xp_boost_data` — incluidos en schema.sql characters table
- [x] `shop_data` en characters — aplicado
- [x] `total_free_rerolls_used`, `total_paid_rerolls` en players — aplicado
- [x] `rewards_applied_for`, columnas defender/mode en aon_matches — aplicado
- [x] `aon_rank_data` en characters — aplicado
- [ ] Verify Vercel env vars:
      NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SYNC_SECRET
      NEXT_PUBLIC_PRIVY_APP_ID, PRIVY_APP_SECRET (get from Privy dashboard → Settings → API Keys)
      CHARACTER_SIGNER_KEY (0x… EVM private key — used by sign-character.ts)
      CHARACTER_SIGNER_SOLANA_KEY (base58 64-byte keypair — used by sign-character-solana.ts)
- [ ] Create Supabase Storage bucket "skins"

### Missing Endpoints
- [x] POST /api/aon/room/open — P1 registers roomId so P2 can discover it (needed for on-chain Solana AoN P2 flow)
  - Requires migration: `ALTER TABLE aon_matches ADD COLUMN IF NOT EXISTS on_chain_room_id text; ALTER TABLE aon_matches ADD COLUMN IF NOT EXISTS on_chain_chain text;`
- [x] Add rate limiting to /api/battle/run (1 battle / 5s per playerId)
- [x] Wire consumable deduction: after battle returns, deduct used consumables from character in DB

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
- [ ] chub-nft Metaplex program — character NFT + mutable metadata
- [ ] Wormhole NTT setup for CHUB token bridging Monad ↔ Solana

---

## 🌐 Frontend

- [ ] Show on-chain CHUB balance in lobby currency bar (once Monad contracts deployed)
- [ ] "Mint Skin NFT" button in inventory (call ERC-721 contract)
- [ ] Show owned skin NFTs from wallet (read from contract)
- [ ] Equip skin from NFT (set character.appearance from on-chain metadata)
- [ ] Call /api/character/sync after level-up, stat changes, skin equip (verify wired correctly)

---

## 🔐 Auditoría de Contratos (hacer antes de mainnet)

- [ ] **Tradability de assets** — verificar que skins (ERC-721 / Metaplex) sean libremente
      transferibles entre wallets; confirmar que CHUB (soulbound) NO es transferible pero
      los NFTs de equipo SÍ lo son
- [ ] **Revisión de exploits — Monad (Solidity)**
  - Reentrancy en AoNEscrow (reward/spend CPIs)
  - Integer overflow / underflow en cálculos de payout y durability
  - Acceso no autorizado a resolveMatch / setAuthorized
  - Replay attacks en sig de personaje (incluye expiryTimestamp en hash)
  - Front-running del relayer en entropyCallback
- [ ] **Revisión de exploits — Solana (Rust/Anchor)**
  - Account substitution attacks (verificar seeds y bumps en cada instrucción)
  - CPI privilege escalation (chub-token reward/spend solo llamable por Config PDA)
  - Doble pago en consume_randomness si se llama dos veces con el mismo VRF result
  - Timeout de VRF — asegurarse de que refund_entropy_stuck no drene fondos incorrectos
  - Ed25519 precompile — verificar que el mensaje canónico incluye room_id + expiry
- [ ] **Bridge de NFTs** — diseñar e implementar el flujo de bridge individual y en conjunto:
  - Bridge individual: un NFT de skin de Monad → Solana (o viceversa) via Wormhole Token Bridge
  - Bridge en lote (bulk): múltiples NFTs en una sola tx para reducir fees
  - Verificar que metadata dinámica (skin_key, rarity, template_id) surviva el bridge
  - Decidir si el bridge "quema y acuña" o usa lock-and-mint
- [ ] **Segunda revisión post-bridge** — re-auditar exploits con el bridge integrado
      (posibles vectores nuevos: mensaje VAA manipulado, doble redención, griefing del relayer)

---

## 🗑️ Delete Account / Reset

- [x] **Botón "Delete Account" real** ✅ Done
  - `deleteAccount()` en frontend: calls POST /api/player/delete, then clears all chubchampions_ localStorage
  - `POST /api/player/delete` endpoint: deletes aon_matches, battle_results, characters, players rows
  - `logoutPlayerSession()` now clears ALL chubchampions_* keys (not just chubchampions_session)
  - `player/state.ts` returns `{ notFound: true }` when player doesn't exist → frontend clears local data

---

## 🎮 Sesión 2026-03-10 — Fixes de animaciones y bugs críticos

### ✅ Resueltos hoy

- [x] **Fix sprites CPU hue-shift 404** — `undefined` string llegaba a `img.src` cuando `winFrames[0]`
      era undefined (extractFrames vacío). Guards en `applyHueShiftPreservingBlacks`,
      `applyHueShiftToFrames`, y asignaciones de `dataset.win/lose`.

- [x] **Fix posicionamiento fighters — escala de coordenadas del servidor**
      El servidor usa `ARENA_WIDTH=1600px` internamente pero el arena real varía por viewport.
      Sin escala, `_homeX=128` se aplicaba como 128px literales en arenas de 700-900px.
      Fix: scale factor `arenaW / 1600` en MoveEvents y retorno al home.
      *(Nota: en producción la arena siempre es 1600px por CSS zoom → scale=1, pero la lógica
       es correcta para cualquier tamaño futuro.)*

- [x] **Fix posición de ataque — usa posición actual del defensor**
      Antes: `_atkLeftPx = arenaW * 0.72` (fijo, solo correcto para posiciones iniciales).
      Ahora: `(defensor._homeX ± _ATCK_GAP) * scale` — sigue al defensor tras MoveEvents.
      `_ATCK_GAP = 100` → overlap físico de -120px → ~5px de contacto visual entre sprites.

- [x] **Fix CSS transition snap — conversión a left:px al inicio de batalla**
      CSS no puede interpolar `right:8%` → `left:Xpx` ni `auto` → `Xpx`.
      `animateBattleFromLog` ahora convierte ambos fighters a `left:px` antes del primer evento.

- [x] **Fix training mode — fighters se acercaban desde las esquinas**
      `generateTrainingEvents` ahora emite un MoveEvent inicial a melee range
      (playerX=650, cpuX=950, gap=80px) antes del primer ataque.

- [x] **Fix TDZ error** — `rerollsUsed`/`rerollsMax` declarados con `let` en línea ~15684
      pero accedidos en `loadProgression` (línea ~11282). Movidos al bloque de globals.

- [x] **Fix battle/run 403 y player/state 500** — columnas faltantes en Supabase causaban
      fallo en queries con lista explícita de columnas. Fix: `select('*')` en run.ts,
      state.ts, spend.ts, levelup.ts.

- [x] **Fix character delete** — solo borraba de localStorage. Nuevo endpoint
      `POST /api/character/delete` + frontend lo llama al eliminar personaje.

- [x] **Schema Supabase** — reescrito completo en `supabase/schema.sql` con todas las
      columnas actuales (player_id, pending_levelup, morale/wellness, minigame_*, etc.)

- [x] **Lobby background** — reemplazado con imagen de mayor resolución.

---

### 🔄 Pendiente — Animaciones y Q-Learning

- [ ] **Seguir refinando el gap de ataque** — `_ATCK_GAP=100` da contacto visual razonable
      pero podría ajustarse más según sprites individuales. Considerar medir el bounding box
      real de cada sprite para un contact detection más preciso.

- [x] **Jump attack** — landing position usa server coords (`_homeX * scale`) en vez de
      `getBoundingClientRect`; gap de ataque consistente con `_ATCK_GAP`; rotación reseteada
      al aterrizar (no espera al return); fase 1 simplificada sin `zoom`/`getBoundingClientRect`.

- [ ] **Q-Learning — posicionamiento preferido por build/arma**
      Actualmente `_ATCK_GAP` es fijo para todos. El CPU debería tener un "preferred range"
      según su arma equipada (spear/gun → distancia mayor) y stats (agi alto → moverse,
      def alto → aguantar en rango medio). El Q-learning ya refuerza esto indirectamente
      pero no hay un bias de inicio por arquetipo.

- [ ] **Q-Learning — acción `jump_fury` y ataques aéreos**
      El counter de jump_fury está implementado en el engine pero la animación aérea y la
      interacción con el sistema de posicionamiento necesita más pruebas y ajustes finos.

- [x] **Movimiento variable — advance_half / retreat_half**
      Agregado `advance_half` y `retreat_half` al pool de Q-learning (5 acciones de movimiento).
      El personaje elige cuánto moverse: paso cauteloso (50% speed) o sprint completo (100%).
      La stamina escala con `movedPx` — caminar menos cuesta menos. `MoveEvent` emite `speed`
      (px/turn reales usados) para que el frontend ajuste el frame rate de la animación.

- [x] **Animación de movimiento — frame rate basado en AGI**
      `animateRun` ahora recibe `speed` (px/turn del personaje) en vez de la duración CSS.
      Frame interval: `max(65, 330 - speed × 0.59)` ms — AGI bajo → ~265ms (lento),
      AGI cap → 65ms (veloz). La transición CSS sigue siendo distancia-based para que
      el personaje llegue a tiempo, pero la cadencia de pasos refleja su agilidad real.

---

## 🗜️ Optimización Q-Table — ✅ Implementado

- [x] Redondear Q-values a 3 decimales en `pruneQTable`
- [x] Serializar Q-table como array (`serializeQTable` / `deserializeQTable`) — ~50% menos tamaño
- [x] Cap 50,000 estados en `pruneQTable` — descarta los menos visitados
- [x] `QL_ATTACK_ACTIONS` = `[...QL_BASIC_ACTIONS, 'jump_attack']` — jump attack como acción Q
- [x] `anti_air` en `QL_ALL_ACTIONS` (índice 17) — solo ofrecida cuando `isJumpAtk2 === true`

---

## ⚔️ Sistema de Ataque Aéreo (Jump Attack + Anti-Air) — ✅ Implementado

### Engine
- [x] `jump_attack` en el pool de ataque del Q-learning (requiere gap > MELEE_RANGE+80 y stamina ≥ 15)
- [x] Al elegir `jump_attack`: segundo Q-lookup de `QL_BASIC_ACTIONS` decide el ataque al pico del arco
- [x] Costo de stamina: 15 (salto) + costo del ataque base
- [x] Multiplicador de daño +70% si llega sin ser interceptado (`isJumpAttack` flag en `executeHit`)
- [x] `playerJumpedThisTurn` / `cpuJumpedThisTurn` en `BattleContext`
- [x] Anti-air disponible como defensa Q solo cuando `isJumpAtk2 === true`
- [x] Anti-air usa kick (o mace si el defensor lo tiene equipado), costo = kick/mace stamina + 7
- [x] 50% full cancel (atacante aterriza con hurt frame, pierde arma si tenía) / 50% disrupted (40% daño)
- [x] Knockback al atacante aéreo: `Math.floor(defStr * 0.4)` px, ×2 con mace
- [x] Posición actualizada en `ctx.playerX/cpuX`, emitida en `knockbackPx/playerX/cpuX`

### Frontend
- [x] Animación de carrera: `jaRunMs` basado en AGI (`280 / jaRunSpd`)
- [x] Animación de arco: `jaArcMs` basado en STR (`860 / jaArcSpd`)
- [x] Peak del arco a `peakMs = jaArcMs * 0.36` — el atacante elige el ataque en ese momento
- [x] `knockdown: true` → muestra `_hurtFrames[0]` por 600ms en el atacante derribado
- [x] `knockbackPx` → desliza al atacante aéreo a la nueva posición con transición 220ms ease-out
- [x] Sincronización de `_homeX` en evento knockdown (posición ya animada por el kick previo)

### Assets pendientes para mace
- [ ] **`Assets/Weapons/Mace Run.png`** — sprite sheet 5 frames × 2 rows (weapon overlay durante carrera)
- [ ] **`Assets/Weapons/Imperial Mace Run.png`** — ídem para mace tier 80
- [ ] **`Assets/Weapons/Mace Attack.png`** — sprite sheet 4 frames × 2 rows (overlay durante ataque)
- [ ] **`Assets/Weapons/Imperial Mace Attack.png`** — ídem para mace tier 80
- [ ] Agregar `attackOverlay: true` a `tier_mace` y `tier_imperial_mace` en `WEAPON_TIERS` (index.html ~11524)
      una vez que los sprite sheets de ataque estén listos — el pipeline los carga automáticamente
- **Nota:** Sin estos archivos la lógica funciona correctamente (daño, knockback ×2, detección de mace)
  pero la animación del anti-air con mace usa punch frames como fallback en vez del overlay de mace.

---

---

## 🧬 Sistema de Modelos de Stats (2026-03-15)

### ✅ Implementado

- [x] **`stat-generator.ts`** — energy incluida en STAT_TOTAL (170) — tradeoff real vs físicos
  - BIASES: O/S/D/B/M/W con `key` letter por archetype
  - `generateStats(modelKey?)` — acepta key para regenerar con el mismo bias
  - Modelo M (Mystic) ajustado: energy [45,68], atk/def bajos — energy como stat primaria
  - ENERGY_MAX subido a 68 (igual que físicos) — build de energy puro es viable

- [x] **`levelup-options.ts`** — pool de 19 opciones con letra única por opción
  - Nueva opción: `Powerhouse (P)` — +20 STR (STR ahora tiene su opción spike igual que ATK/AGI/DEF)
  - Nuevas opciones energy alta: `Surge (G)` +22, `Fierce Channel (K)` +22 ATK+energy, `Arcane Flood (A)` +28
  - Tabla de letras: H/L/I/P/W/B/C/S/N/F/E/M/U/Y/D/T/R/G/K/A

- [x] **`stat_model` column (characters table)** — tipo `text` — historial de level-ups
  - Una letra por cada nivel ganado: ej. `"BWCNFE..."` al nivel 7
  - `levelup/apply` concatena la letra elegida al aplicar cada level-up
  - `sync.ts` NO guarda arquetipo de creación — solo level-ups cuentan

- [x] **`base_stats` column (characters table)** — tipo `jsonb` — snapshot de stats al nivel 1
  - Escrito una sola vez en `sync.ts` al crear el personaje, nunca sobreescrito
  - Permite recalcular stats exactos si se cambian valores de opciones: `base_stats + suma(stat_model)`

### ✅ Migrations Supabase aplicadas

```sql
ALTER TABLE players    ADD COLUMN IF NOT EXISTS crystals integer not null default 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS exp integer not null default 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS player_id text;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS stat_model text;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS base_stats jsonb;
CREATE INDEX IF NOT EXISTS idx_characters_player_id ON characters(player_id);
```

---

## 🧬 Sistema Elemental + Biases (2026-03-16)

### ✅ Implementado

- [x] **`stat-generator.ts`** — STAT_TOTAL 185, ENERGY_MAX 68 (igual que físicos), pool compartido
  - 11 biases: O/S/D/B/M/W + nuevos E(Arcane)/A(Arcane Swift)/T(Tank-Mage)/R(Rogue)/G(Guardian)
  - Guardian (G): STR[30-58] + DEF[30-58] simultáneos — tanque físico puro sin energy
  - Rangos de energy corregidos en O/S/D → [20,40]; B → [25,50] flat; M/W/E/A/T actualizados

- [x] **Flujo element-first en creación de personaje** (index.html)
  - Jugador elige elemento antes de ver stats → element card click llama `generate_stats` al servidor
  - Stats se muestran como `--` hasta elegir elemento; botón REROLL deshabilitado hasta entonces
  - Botón CREATE deshabilitado hasta elegir elemento

- [x] **Sistema de rerolls escalante y server-autoritativo** (economy/spend.ts)
  - `REROLL_COST_TABLE = [25, 35, 50, 70, 100, 140, 195, 270, 375, 525]` luego ×1.4
  - Char 1: 2 free rerolls; char 2: +1 free (total 3); char 3+: sin free, pago desde donde quedó
  - Contadores en DB: `total_free_rerolls_used` + `total_paid_rerolls` (anti-exploit)
  - Server retorna `freeRemaining` + `nextCost`; frontend sincroniza desde respuesta del servidor

- [x] **Fórmula elemental 2-stat en fury powers** (engine.ts)
  - `getElementPowerSec(el, stats)`: combo ponderado por elemento reemplaza `secStat` único
    - Fire: ENE×0.6+STR×0.4 | Lightning: ENE×0.7+STR×0.3 | Earth: STR×0.7+ENE×0.3
    - Wind: AGI×0.6+ENE×0.4 | Water: ENE×0.7+AGI×0.3
  - Pasivos elementales ahora escalan con los stats clave del elemento (fire→ENE+STR, etc.)

### ⚠️ Migration Supabase pendiente

```sql
ALTER TABLE players ADD COLUMN IF NOT EXISTS total_free_rerolls_used integer not null default 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS total_paid_rerolls      integer not null default 0;
ALTER TABLE aon_matches ADD COLUMN IF NOT EXISTS rewards_applied_for text[] DEFAULT '{}';
```

---

## ✅ Wall Bounce + Corner Pressure — Implementado

> Acordado en sesión 2026-03-16, implementado y verificado en sesión 2026-03-22.

### Idea general
Cuando un personaje es arrojado por un combo finisher y su knockback lo lleva hasta el borde
de la arena, rebota contra la pared y vuelve unos píxeles hacia el centro. Esto:
- Crea un objetivo de posicionamiento: arrinconar al oponente tiene recompensa real
- El rebote puede disparar un hit de seguimiento (kick)
- Cuanto más cerca de la pared está el defensor, mayor la probabilidad de combo del atacante

### Mecánica de rebote
- **Trigger:** solo en **combo finisher** (280px knockback). Fury powers con knockback
  (Tsunami, Giant Rock) también candidatos — decidir en sesión.
- **Detección:** si el `toX` post-knockback fue clamped por `Math.max(0,...)` o
  `Math.min(ARENA_WIDTH - FIGHTER_WIDTH,...)`, significa que tocó la pared → rebote.
- **Distancia de rebote:** `80px` de vuelta hacia el centro — pequeño, solo táctico/visual.
- **Follow-up:** ventana de ataque para el atacante (similar al back-attack post-crossover):
  chance de un kick de seguimiento antes de que el defensor se recupere.

### Corner pressure (bonus de combo)
- **Variable:** `distToNearestWall = min(defenderX, ARENA_WIDTH - FIGHTER_WIDTH - defenderX)`
- **Pressure factor:** `distPressure = clamp((300 - distToNearestWall) / 300, 0, 1)`
  → 0% a 300px+ de la pared, 100% (máximo efecto) en el borde mismo
- **Bonus a `comboChance`:** `+ distPressure * 0.06` → máximo **+6%** en el borde
- **Cap total de `comboChance`:** `0.38` — para que no se vuelva cheese con builds muy rápidos

### Valores acordados
```
WALL_BOUNCE_PX         = 80     // rebote tras tocar el borde
CORNER_PRESSURE_RANGE  = 300    // distancia desde la pared donde empieza el efecto
CORNER_COMBO_BONUS_MAX = 0.06   // +6% máximo de comboChance en el borde exacto
COMBO_CHANCE_CAP       = 0.38   // cap total de comboChance (actualmente no hay cap explícito)
```

### ✅ Implementado (backend)
- [x] `engine.ts` — detecta wall clamp en knockback del combo finisher, emite `MoveEvent` de rebote, suma corner factor a `comboChance`
- [x] `constants.ts` — `WALL_BOUNCE_PX`, `CORNER_PRESSURE_RANGE`, `CORNER_COMBO_BONUS_MAX`, `COMBO_CHANCE_CAP`

### ✅ Implementado (frontend)
- [x] Animación de rebote: slide ease-out con hurt frame, `bounceDamage` con `showDamage` — índice ~18011

---

---

## ✅ Sesión 2026-03-19/20 — Rename + Auth + UX fixes

### Rename FightChub → Chub Champions
- [x] GitHub repos renombrados: `FightChub` → `ChubChampions`, `fight-chub-backend` → `ChubChampionsBackend`
- [x] Vercel project renombrado: `fight-chub-backend` → `chub-champions-backend`
- [x] `vite.config.js` base path: `/FightChub/` → `/ChubChampions/`
- [x] `LoginGate.jsx` título y asset paths actualizados
- [x] `BACKEND_URL` en index.html: `chub-champions-backend.vercel.app`
- [x] Backend pages y comentarios actualizados
- [x] Contratos: `FightChubCharacter.sol` → `ChubChampionsCharacter.sol`, `FightChubSkin.sol` → `ChubChampionsSkin.sol`

### Auth / Login
- [x] **Selección de chain en primer login** — `LoginGate.jsx` redirige a `chub-champions-backend.vercel.app/` si el usuario no tiene wallet; backend muestra MONAD / SOLANA
- [x] **Fix "Setup incomplete" notice** — `sendToGame()` usa el address devuelto por `createWallet()` directamente (user.linkedAccounts era stale)
- [x] **Fix export wallet popup** — popup llamaba `window.close()` si no estaba autenticado en el dominio backend; ahora llama `login()` primero
- [x] **Removed cross-origin token-refresh iframe** — eliminado iframe oculto que causaba `SecurityError: Failed to read window.ethereum`; `window.__getPrivyToken` ahora proviene de `LoginGate.jsx` directamente

### UI
- [x] **Eliminados modos de test** — POWER LAB y TRAINING removidos del lobby, HTML, CSS y JS
- [x] **Eliminado botón DELETE ACCOUNT** del lobby y función `deleteAccount()`
- [x] **Session name** — fuente cambiada a DynaPuff, color oscuro, tamaño aumentado
- [x] **Monad chain label** — "EVM · Compatible" → "EVM · Low fees"

### TypeScript fixes (previos al deploy)
- [x] `qTable` type cast en `aon/accept.ts`
- [x] `isAonRound` declarado antes de uso en `battle/run.ts`
- [x] `charId` agregado al tipo `playerRank` en `leaderboard/index.ts`
- [x] `calcRankingDelta` args faltantes en `matchmaking/join.ts`

### CORS
- [x] `middleware.ts` (Edge) — maneja OPTIONS preflight y agrega headers CORS a todas las rutas `/api/*`
- [x] `vercel.json` — headers CORS a nivel CDN como respaldo

---

## ⚡ Level-Up Fixes (2026-03-22)

### ✅ Implementado
- [x] **Fix false double level-up** — `battle/run.ts` ahora chequea `pending_levelup` y usa `effectiveLevel` para calcular el threshold correcto
- [x] **Fix level exploit via sync.ts** — ignorar nivel del cliente completamente; siempre usar DB level
- [x] **Fix pending level-ups perdidos al recargar página** — `fetchCharactersFromServer` restaura pending level-ups desde `hasPendingLevelUp` del servidor
- [x] **Fix chain level-ups** — si el EXP acumulado alcanza para 2+ niveles, `levelup/apply` detecta y encadena automáticamente (sets `pending_levelup: true` de nuevo + descuenta EXP)
- [x] **Bloqueo de matchmaking con level-ups pendientes** — BATTLE, AoN y PvP bloqueados si hay stat upgrades sin aplicar; pantalla de resultados oculta PLAY AGAIN si hay level-up pendiente

### 🔴 Pendiente
- [ ] **Deploy backend** con los fixes de level-up (battle/run.ts, character/sync.ts, character/levelup.ts)
- [ ] **Deploy frontend** con los cambios de index.html (pending level-up restore, battle blocking, chain level-ups)

---

## 🏦 ChubVault — Deposit/Withdraw Bridge (2026-03-22)

### ✅ Implementado
- [x] **ChubVault.sol** (Monad/Foundry) — deposit burns CHUB via `token.spend()`, withdraw mints via EIP-712 signed permit + `token.reward()`, circuit breaker held payouts, daily caps, configurable limits
- [x] **DeployVault.s.sol** — Forge deploy script, authorizes vault in ChubToken
- [x] **Solana chub-vault Anchor program** — initialize, deposit (SPL burn), withdraw (Ed25519 sig verification via instruction introspection + CPI to chub-token reward), admin (set_signer, set_limits), UserNonce PDA per-user
- [x] **`backend/pages/api/tokens/deposit.ts`** — chain-aware (monad + solana), verifies tx on-chain, prevents double-credit via `vault_deposits` table, credits Supabase tokens
- [x] **`backend/pages/api/tokens/withdraw.ts`** — chain-aware, EIP-712 sig (monad) / Ed25519 sig (solana), daily cap enforcement, deducts Supabase tokens, records in `vault_withdrawals`
- [x] **`backend/lib/chains.ts`** — Monad testnet chain definition for viem (id: 10143)
- [x] **Frontend vault UI** — VAULT button in top nav, vault panel (slides from right), chain selector (Solana/Monad auto-detect), deposit/withdraw tabs, amount presets, status messages, ethers.js integration for Monad flows
- [x] **Fix ERC712 → EIP712 typo** in ChubVault.sol constructor
- [x] **Fix tokensCredired → tokensCredited** typo in deposit.ts
- [x] **Removed unnecessary ERC20 approve** from Monad deposit (vault uses `spend()` as authorized contract)
- [x] **`backend/pages/api/tokens/buy.ts`** — player sends SOL/MON to treasury wallet, backend verifies tx on-chain, credits CHUB in Supabase at configurable exchange rate. Anti-double-credit via `vault_deposits` table
- [x] **Frontend BUY tab** in vault panel — input native amount, live CHUB preview, wallet selector (embedded Privy or external MetaMask/Phantom), calls `/api/tokens/buy`
- [x] **Privy Solana config** — `solanaClusters` added to main.jsx (devnet + mainnet-beta), Solana enabled in Privy dashboard
- [x] **Privy wallet bridge** — LoginGate.jsx exposes `__privyGetEvmProvider()`, `__privyGetSolanaWallet()`, `__privyHasEmbeddedWallet()` to vanilla JS for embedded wallet signing

### 🔴 Pendiente — Activar BUY + AoN on-chain

> **Decisión**: CHUB es moneda interna (Supabase). NO hay token ERC-20/SPL on-chain.
> Los contratos de ChubToken/ChubVault quedan en el repo por si se tokeniza en el futuro, pero no se despliegan.
> Lo que SÍ va on-chain: **AoN escrow** (apuestas PvP) y **torneos** (futuro).

#### Supabase migrations
- [ ] Crear/actualizar tabla `vault_deposits` (pack-based buy + USDC):
  ```sql
  CREATE TABLE IF NOT EXISTS vault_deposits (
    id bigserial PRIMARY KEY,
    tx_hash text UNIQUE NOT NULL,
    player_id text NOT NULL,
    wallet text NOT NULL,
    chain text NOT NULL CHECK (chain IN ('solana', 'monad')),
    tokens_credited integer NOT NULL,
    type text NOT NULL DEFAULT 'buy' CHECK (type IN ('buy', 'deposit')),
    native_amount numeric,
    pack_id text,
    currency text DEFAULT 'native' CHECK (currency IN ('native', 'usdc')),
    created_at timestamptz DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS idx_vault_deposits_player ON vault_deposits(player_id);
  CREATE INDEX IF NOT EXISTS idx_vault_deposits_tx ON vault_deposits(tx_hash);
  ALTER TABLE vault_deposits ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Players read own deposits" ON vault_deposits FOR SELECT USING (player_id = auth.uid()::text);
  ```
  Si ya existe la tabla vieja, correr:
  ```sql
  ALTER TABLE vault_deposits ADD COLUMN IF NOT EXISTS pack_id text;
  ALTER TABLE vault_deposits ADD COLUMN IF NOT EXISTS currency text DEFAULT 'native' CHECK (currency IN ('native', 'usdc'));
  ```

#### Treasury wallets (REQUERIDO para activar BUY)
Necesitas **2 wallets treasury** (una por chain) que reciban los pagos de los jugadores.
Estas wallets son tuyas — los jugadores envían SOL/MON a ellas y el backend verifica on-chain.

- [ ] **Generar wallet treasury EVM (Monad)**:
  - Crear nueva keypair EVM (MetaMask → crear cuenta, o `cast wallet new`)
  - Guardar la **private key** en lugar seguro (NO en el código)
  - Copiar la **dirección pública** (0x...) → poner en Vercel env var `TREASURY_WALLET_MONAD`
  - También copiar a `index.html` constante `TREASURY_WALLET_MONAD`
- [ ] **Generar wallet treasury Solana**:
  - Crear nueva keypair Solana (`solana-keygen new -o treasury-sol.json`, o Phantom → crear cuenta)
  - Guardar la **private key** en lugar seguro
  - Copiar la **dirección pública** (base58) → poner en Vercel env var `TREASURY_WALLET_SOLANA`
  - También copiar a `index.html` constante `TREASURY_WALLET_SOLANA`
- [ ] `CHUB_RATE_MONAD` — cuántos CHUB por 1 MON (default: 10000)
- [ ] `CHUB_RATE_SOLANA` — cuántos CHUB por 1 SOL (default: 10000)

#### Vercel env vars (buy)
- [ ] `TREASURY_WALLET_MONAD` — dirección EVM que recibe MON
- [ ] `TREASURY_WALLET_SOLANA` — dirección Solana que recibe SOL
- [ ] `SOLANA_RPC_URL` — RPC de Solana devnet (default: `https://api.devnet.solana.com`)

#### AoN on-chain — Diseño "Verified Battle" (escrow + Q-learning verificable)

**Arquitectura:**
El backend corre la batalla completa con Q-learning y graba cada decisión.
El contrato re-ejecuta la batalla con esas decisiones para verificar el resultado.
Las decisiones (qué acción tomar) vienen del backend; los outcomes (crit, dodge success, dmg rolls)
los resuelve el contrato con el seed de Pyth Entropy.

```
Flujo:
  1. P1 createRoom() → deposita MON/SOL nativo como entry fee
  2. P2 joinRoom()   → deposita MON/SOL, dispara Pyth Entropy → seed
  3. Backend lee el seed + Q-tables de ambos personajes (Supabase)
     → corre batalla completa con Q-learning
     → graba array de decisiones: [kick, dodge, punch, block, ...]
  4. Backend llama contrato.resolveBattle(roomId, decisions[])
     → contrato re-ejecuta la batalla usando decisions[] + seed
     → verifica que cada decisión era válida (stamina, cooldown, etc.)
     → confirma resultado → paga al ganador en MON/SOL
```

**decisions[] = uint8[] (~100-250 entries por batalla, muy barato en gas)**
- Solo las decisiones de Q-learning (qué acción: punch/kick/dodge/block/etc.)
- Los outcomes (crit rolls, dodge success, dmg) siguen siendo del seed (RNG on-chain)
- Si alguien pasa decisiones inválidas, el contrato las rechaza

**Tareas:**
- [x] Reescribir AoNEscrow para escrow de MON nativo (sin ChubToken dependency)
- [x] Agregar `resolveBattle(roomId, uint8[] decisions)` al contrato (Monad + Solana)
- [x] Modificar `BattleEngine.sol` para aceptar decisions[] en vez de RNG para elegir acciones
- [ ] Agregar sistema posicional y stamina al engine on-chain (para paridad con backend)
- [x] Backend: endpoint para submit decisions al contrato post-batalla
  - `POST /api/aon/resolve-onchain` — internal, calls resolveBattle on-chain
  - `POST /api/aon/poll-resolve` — cron-triggered, polls for WaitingResolution rooms
  - `lib/aon/resolve.ts` — core resolve logic (Monad + Solana implemented)
- [x] On-chain battle animated replay system
  - `POST /api/aon/replay` — loads both characters from Supabase, runs JS engine with on-chain seed, returns event log
  - `POST /api/aon/room/join` — P2 registers character ID when joining on-chain room (needed for replay)
  - `room/open.ts` updated: returns matchId, accepts matchId=0 (finds by playerId+status)
  - `resolve.ts` updated: updates aon_matches status to 'resolved' after on-chain resolution
  - Frontend `aonJoinSameChainMonad`: registers P2 char → joins on-chain → waits for resolution → fetches replay → animates via startPvpBattle
  - Frontend `aonStartMatchmakingOnChain` (P1): captures matchId from room/open → fetches replay after resolution → animates
  - Fallback: if replay fetch fails, shows static result (winner/turns/payout)
  - **Requires migration**: `ALTER TABLE aon_matches ADD COLUMN IF NOT EXISTS defender_char_id text; ALTER TABLE aon_matches ADD COLUMN IF NOT EXISTS defender_display_name text; ALTER TABLE aon_matches ADD COLUMN IF NOT EXISTS defender_player_id text;`
- [x] Backend: integrar Q-learning decisions (Q-tables de Supabase → generateDecisions con chooseQLAction)
  - `resolve.ts`: loadMatchQData() carga Q-tables de ambos chars desde Supabase
  - generateDecisions() usa chooseQLAction + encodeState simplificado para generar uint8[]
  - Fallback a seedQTableFromStats() si Q-tables vacías
  - resolveOnSolana() implementado: lee Room PDA, genera decisions, envía resolve_battle tx
- [ ] Deploy AoNEscrow en Monad testnet
- [ ] Mismo diseño para Solana (Rust program con decisions[] input) — ya escrito, falta deploy
- [ ] Frontend: adaptar AoN para apostar MON/SOL nativo (no CHUB tokens)

#### Descartado (contratos en repo pero NO se despliegan)
- ~~ChubToken.sol (ERC-20)~~ — CHUB es moneda interna
- ~~ChubVault.sol (deposit/withdraw)~~ — no hay token on-chain
- ~~Solana programs (chub_token, chub_nft)~~ — misma razón
- ~~vault_withdrawals table~~ — no hay withdrawals
- ~~Endpoints deposit.ts / withdraw.ts~~ — no se usan

---

## ⚔️ Sesión 2026-03-28 — Damage Refactor + Server-Authoritative Timer

### ✅ Refactored damage formula (backend `engine.ts`)
- [x] **Hybrid additive damage scaling** — stats ahora suman al daño base en vez de multiplicar
  - Stage 1: `effectiveBase = baseDamage + softStat(ATK) * 0.35 + softStat(secondary) * 0.20/0.30`
  - Stage 2: DEF reduction sin cambio (`dmg * 100 / (100 + effectiveDef)`)
  - Stage 3: Buffs aditivos (crit, fury, elemental, war_tonic, position) → `dmg *= (1 + buffPool)`
  - Stage 4: Reducción aditiva (earth, gaze, iron_skin) → `dmg *= max(0.10, 1 - reductionPool)`
  - Stage 5: Skill bonuses (siguen multiplicativos)
  - **Razón:** multiplicativo compuesto hacía que stats bajos fueran irrelevantes y altos explosivos; HP crece lineal (+66/lvl) pero daño crecía exponencial → batallas nunca terminaban en KO

### ✅ Camera fix (frontend `index.html`)
- [x] **Hard-clamp después del lerp** en `_camTick()` — zoom y translación lerpean independientemente, lo que causaba `_camTransX` fuera del rango válido durante transiciones → bordes negros en el BG
- [x] **BG layer clamp** — `bgTx` también clampeado para evitar gaps en los bordes

### ✅ AoN modal width
- [x] `max-width: 740px; width: 94%` (era 620px/92%) — texto ya no desborda con flechas de scroll

### ✅ Background tab battle fix (frontend `index.html`)
- [x] **`battleRAF()` helper** — reemplaza `requestAnimationFrame` con fallback a `setTimeout(16ms)` cuando el tab está oculto → las animaciones no se congelan en background tabs
- [x] **`_animPending` Set + `trackAnim`/`untrackAnim`** — rastreo de promesas de animación RAF para poder flushearlas en `endByTimeout`

### ✅ Server-authoritative match timer (Option D)
- [x] **`estimateEventDurationMs()`** en `engine.ts` — mapea CADA tipo de evento a su duración de animación en el frontend:
  - `log`=40ms, `skill_effect`=180ms, `consumable`=280ms, `weapon_equip`=80ms, `weapon_throw`=220ms, `weapon_drop`=120ms
  - `combo`=20ms, `combo_finisher`=1800ms (5 fases sumadas)
  - `fury_power`=variable (450ms pasivos, 980ms-3800ms activos dependiendo del poder)
  - `move`=variable (distancia/velocidad basado, 20ms-620ms)
  - `attack`=variable (AGI-based `atkMult`, approach+attack+defense+return, ~1200-2300ms)
  - `stamina`/`fury_update`/`turn_steal`/`game_over`=0ms
- [x] **`MATCH_TIME_LIMIT_MS = 90_000`** en `constants.ts`
- [x] **`animTimeMs` acumulador** en `BattleContext` — cada `emit()` suma la duración estimada
- [x] **Auto-stop en 90s** — cuando `animTimeMs >= MATCH_TIME_LIMIT_MS`, `emit()` setea `gameOver=true` y snapshota HP
- [x] **`timeLimitHp` snapshot** — captura HP exacto al momento del corte (no el HP final del turno que pudo seguir ejecutándose)
- [x] **`matchDurationMs` en `BattleResult`** — retornado al frontend para sincronizar el timer
- [x] **Frontend usa `matchDurationMs`** — `animateBattleFromLog` reinicia el timer con `ceil(matchDurationMs / 1000)` segundos del servidor
- [x] **`matchmaking/join.ts`** actualizado — `resultToStore` incluye `matchDurationMs` para PvP
- [x] **`flipBattleResult`** — pasa `matchDurationMs` automáticamente via spread

### Cómo funciona el timer ahora
```
1. Server corre batalla, acumula tiempo de animación por cada evento emitido
2. Cuando el acumulado llega a 90s → server para, elige ganador por HP
3. Server retorna matchDurationMs + eventos + HP final
4. Frontend inicia timer con el valor del server (no hardcoded 90s)
5. Frontend reproduce eventos; si terminan antes del timer → game_over natural (KO)
6. Si timer llega a 0 antes → endByTimeout muestra resultado del server
7. Ambos lados SIEMPRE coinciden porque la misma función de duración corre en el server
```

### ⚠️ Cosas a verificar/calibrar
- [ ] **Calibrar duraciones de `estimateEventDurationMs`** — los valores actuales son estimados de los `sleep()` del frontend. Si las animaciones cambian en el futuro, hay que actualizar los valores del backend para que sigan sincronizados.
- [ ] **Combos en la estimación de attack** — la estimación de `attack` siempre cuenta approach+return completo, pero los combo follow-ups en realidad son más cortos (snap 15ms, no run 300ms). Esto puede hacer que el server sobreestime el tiempo → batallas terminan un poco antes de los 90s reales. Si se nota, refinar con contexto de combo (mirar evento previo).
- [ ] **Probar battles largos (high DEF + healing)** — verificar que el timer realmente corta a ~90s y no antes/después. Si las batallas terminan consistentemente a 80s o 95s, ajustar los multiplicadores en `estimateEventDurationMs`.
- [ ] **Background tab behavior** — verificar que cuando el usuario vuelve al tab, el `endByTimeout` muestra el resultado correcto si el timer ya expiró.

---

## 🔍 Nice to Have

- [ ] Battle replay (store event log, let player replay past fights)
- [ ] Leaderboard page (query battle_results by win count)
- [ ] Push notifications for chest unlock ready
- [ ] Mobile layout polish
- [ ] New skill branch (effect TBD)

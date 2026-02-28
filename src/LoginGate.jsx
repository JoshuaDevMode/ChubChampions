import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function LoginGate() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const [visible, setVisible] = useState(false);

  // user is in deps so we re-run once it's populated after authenticated=true
  useEffect(() => {
    if (!ready || !user) return;
    if (authenticated) {
      handleAuthenticated();
    } else {
      setVisible(true);
    }
  }, [ready, authenticated, user]);

  // Show gate on JS-side logout event
  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener('fightchub:showlogin', show);
    return () => window.removeEventListener('fightchub:showlogin', show);
  }, []);

  // Expose Privy functions to vanilla JS
  useEffect(() => {
    window.__privyLogout   = logout;
    window.__getPrivyToken = getAccessToken;
    return () => { window.__privyLogout = null; window.__getPrivyToken = null; };
  }, [logout, getAccessToken]);

  async function handleAuthenticated() {
    try {
      const token = await getAccessToken();

      // Returning user (session already in localStorage) — just refresh token, don't re-init game
      const savedSession = localStorage.getItem('fightchub_session');
      if (savedSession) {
        if (token) window.__privyUpdateToken?.(token);
        setVisible(false);
        return;
      }

      // Fresh login — build full session and init game
      const privyId  = user.id;
      const playerId = privyId.startsWith('did:privy:') ? privyId.slice(10) : privyId;

      const linkedWallet = user.linkedAccounts?.find(a => a.type === 'wallet');
      const wallet = linkedWallet?.address || user.wallet?.address || '';

      const twitterAcc = user.linkedAccounts?.find(a => a.type === 'twitter_oauth');
      const emailAcc   = user.linkedAccounts?.find(a => a.type === 'email');
      const name = twitterAcc?.username
        || (emailAcc?.address ? emailAcc.address.split('@')[0] : '')
        || 'Fighter';

      const avatar = twitterAcc?.profilePictureUrl || '';

      window.__privyLogin?.({ playerId, wallet, name, avatar, token });
      setVisible(false);
    } catch (err) {
      console.error('[LoginGate] handleAuthenticated error:', err);
    }
  }

  if (!visible) return null;

  return (
    <div id="login-gate" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at center, #12102a 0%, #06050f 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{
        fontSize: 'clamp(18px, 4vw, 32px)', color: '#c4b5fd',
        textShadow: '0 0 30px rgba(167,139,250,0.6), 0 0 70px rgba(124,58,237,0.3)',
        letterSpacing: '4px', marginBottom: '2px',
      }}>FIGHTCHUB</div>

      <div style={{
        fontSize: 'clamp(6px, 1.2vw, 9px)', color: '#6b7280', letterSpacing: '1px',
      }}>THE ARENA AWAITS</div>

      <div style={{
        position: 'relative',
        width: 'clamp(280px, 65vmin, 420px)',
        height: 'clamp(280px, 65vmin, 420px)',
        filter: 'drop-shadow(0 0 28px rgba(124,58,237,0.55))',
      }}>
        <img
          src="/FightChub/Assets/UI/stone-frame.png"
          alt=""
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: '14%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{
            fontSize: 'clamp(7px, 1.6vmin, 12px)', color: '#e9d5ff',
            textAlign: 'center', lineHeight: 1.7,
          }}>CONNECT TO<br />ENTER<br />THE ARENA</div>

          <button
            onClick={login}
            style={{
              display: 'block', width: '90%', padding: '10px 0',
              background: 'linear-gradient(to bottom, #7c3aed, #5b21b6)',
              border: '2px solid #a78bfa', borderRadius: '8px',
              color: '#fff', fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(6px, 1.3vmin, 10px)', letterSpacing: '1px',
              cursor: 'pointer', textAlign: 'center',
              boxShadow: '0 3px 0 #3b0764',
            }}
          >LOGIN TO PLAY</button>

          <div style={{
            fontSize: 'clamp(4px, 0.9vmin, 7px)', color: '#9ca3af',
            textAlign: 'center', lineHeight: 1.6,
          }}>Login with X or<br />connect your wallet</div>
        </div>
      </div>
    </div>
  );
}

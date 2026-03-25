import { useEffect, useId } from 'react';

export default function GoogleLoginButton({ onSuccess, onError, disabled = false }) {
  const buttonId = useId().replace(/:/g, '');

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    let cancelled = false;

    const handleCredentialResponse = (response) => {
      console.log('Google credential:', response);

      if (!response?.credential) {
        console.error('No credential received');
        onError?.(new Error('No credential received'));
        return;
      }

      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join('')
        );

        const user = JSON.parse(jsonPayload);

        console.log('Decoded user:', user);

        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: user.name,
          picture: user.picture
        }));

        onSuccess?.({ user });
        window.location.reload();
      } catch (error) {
        console.error('Error decoding credential', error);
        onError?.(error);
      }
    };

    const initialize = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (cancelled || !window.google?.accounts?.id || !clientId) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      });

      const container = document.getElementById(buttonId);
      if (!container) {
        return;
      }

      container.innerHTML = '';
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 320
      });

      window.google.accounts.id.prompt();
    };

    const timeoutId = window.setTimeout(initialize, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [buttonId, disabled, onError, onSuccess]);

  return (
    <div className="space-y-3">
      <div id={buttonId} className={disabled ? 'pointer-events-none opacity-60' : ''} />
      {!import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <p className="text-xs leading-5 text-earth-500">
          Configura <code>VITE_GOOGLE_CLIENT_ID</code> para activar Google Sign-In.
        </p>
      ) : null}
    </div>
  );
}

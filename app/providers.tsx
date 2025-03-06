'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from 'next-themes';

// import type { User } from '@privy-io/react-auth';

// const handleLogin = (user: User) => {
//   console.log(`User ${user.id} logged in!`);
// };

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        // onLogin={handleLogin}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#F59E0B',
            showWalletLoginFirst: true,
          },
        }}
      >
        {children}
      </PrivyProvider>
    </ThemeProvider>
  );
}

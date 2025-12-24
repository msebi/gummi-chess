import '@/styles/globals.css'; // This is the line that imports Tailwind
import type { AppProps } from 'next/app';
import Layout from 'apps/web/components/Layout'; // Adjust the path as necessary
import { SessionProvider } from 'next-auth/react'; // Import the provider
// TODO: change font as needed
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-roboto', // Creates a CSS variable; integrate with Tailwind
});

function ChessApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // This Component prop is the active page
  // So this wrapper is applied to every page
  return (
    <Layout>
      <SessionProvider session={session}>
        {/* Apply the font's variable and a bases class  */}
        <main className={`${roboto.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </Layout>
  );
}

export default ChessApp;
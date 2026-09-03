import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://akaia-atelier.sites.openai.com'),
  title: 'Akaia — Fotografia & Filme',
  description: 'Estúdio Akaia, por Danilo Alvarez. Fotografia, filmes e experiências visuais em Belo Horizonte.',
  openGraph: { title: 'Akaia — Fotografia & Filme', description: 'Imagens que guardam o que o tempo move.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Akaia — Fotografia & Filme', description: 'Imagens que guardam o que o tempo move.', images: ['/og.png'] }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

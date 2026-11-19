import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AOSProvider } from '@/components/AOSProvider';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AOSProvider />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

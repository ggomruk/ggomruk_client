'use client';

import Footer from '../components/footer';
import Navbar from '../components/navbar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar />
        {children}
        <Footer />
    </>
  );
}

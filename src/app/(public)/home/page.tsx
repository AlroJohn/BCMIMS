// app/(home)/home/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home section of my Next.js application!</p>
      <p>
        Explore more: <Link href="/about">About Us</Link> |{' '}
        <Link href="/contact">Contact Us</Link>
      </p>
    </div>
  );
}
import { Header } from '@/components/header';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header showAuth={false} />
      {children}
    </>
  );
}
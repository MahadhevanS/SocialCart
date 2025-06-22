import { notFound } from 'next/navigation';
import { ProfilePageClient } from '@/components/profile/ProfilePageClient';
import { mockUsers } from '@/lib/mockData';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = mockUsers.find(u => u.username === params.username);

  if (!user) {
    notFound();
  }

  return <ProfilePageClient user={user} />;
}

export async function generateStaticParams() {
  return mockUsers.map((user) => ({
    username: user.username,
  }));
}

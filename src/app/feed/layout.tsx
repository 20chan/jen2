import { AuthProxy } from '@/components/AuthProxy';
import Link from 'next/link';

const tabs = [
  {
    label: 'Dashboard',
    groups: [
      {
        label: '/',
        path: '/',
      },
    ],
  },
];

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-row'>
      <div className='basis-56 bg-half-dark-white/10'>
        <div className='flex flex-col px-4 py-4'>
          <div className='border-b border-b-half-dark-white mb-4'>
            <div className='text-4xl font-bold uppercase py-8 text-center'>
              Feed
            </div>
          </div>
          {
            tabs.map(({ label, groups }) => (
              <div key={label} className='flex flex-col py-2'>
                <div className='font-bold uppercase text-half-white/70'>
                  # {label}
                </div>
                {
                  groups.map(({ label, path }) => (
                    <Link key={label} href={`/feed/${path}`} className='ml-2 py-0.5 text-half-white/70'>
                      - {label}
                    </Link>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>

      <AuthProxy>
        <div className='min-h-screen py-12 pl-12'>
          {children}
        </div>
      </AuthProxy>
    </main>
  );
}
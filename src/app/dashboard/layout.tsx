import Link from 'next/link';

const tabs = [
  {
    label: 'Dashboard',
    groups: [
      {
        label: '/',
        path: '/',
      },
      {
        label: 'Summary',
        path: '/summary',
      },
    ],
  },
  {
    label: 'transactions',
    groups: [
      {
        label: 'list',
        path: '/transactions',
      },
      {
        label: 'edit',
        path: '/edit-transaction',
      },
    ],
  },
];

export default function DashboardLayout({
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
              Dashboard
            </div>
          </div>
          {
            tabs.map(({ label, groups }) => (
              <div key={label} className='flex flex-col py-2'>
                <div className='font-bold uppercase'>
                  # {label}
                </div>
                {
                  groups.map(({ label, path }) => (
                    <Link key={label} href={`/dashboard/${path}`} className='ml-2 py-0.5'>
                      - {label}
                    </Link>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>

      <div>{children}</div>
    </main>
  );
}
import { AuthProxy } from '@/components/AuthProxy';

export default function TransactionLayout({
  transaction,
  category,
}: {
  transaction: React.ReactNode;
  category: React.ReactNode;
}) {

  return (
    <AuthProxy>
      <div className='flex flex-row'>
        {transaction}
        {category}
      </div>
    </AuthProxy>
  )
}
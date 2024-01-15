export default function TransactionLayout({
  transaction,
  category,
}: {
  transaction: React.ReactNode;
  category: React.ReactNode;
}) {

  return (
    <div className='flex flex-row'>
      {transaction}
      {category}
    </div>
  )
}
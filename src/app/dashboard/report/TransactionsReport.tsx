import * as R from 'remeda';
import { Transaction } from '@prisma/client';

export function TransactionsReport({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const incomings = transactions.filter(x => x.amount > 0);
  const outgoings = transactions.filter(x => x.amount < 0);

  const totalIncoming = R.sumBy(incomings, x => x.amount);
  const totalOutgoing = R.sumBy(outgoings, x => x.amount);

  return (
    <div>
      <div>
        total incoming: {totalIncoming}
      </div>
      <div>
        total outgoing: {totalOutgoing}
      </div>
    </div>
  )
}
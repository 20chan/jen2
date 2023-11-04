import { BalanceSummary } from './BalanceSummary';
import { TransactionList } from './TransactionList';

export default async function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>

        <BalanceSummary />
        <TransactionList />
      </div>
    </main>
  )
}
import { AuthProxy } from '@/components/AuthProxy';
import { BalanceSummary } from './BalanceSummary';

export default async function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div>
        <AuthProxy>
          <BalanceSummary />
        </AuthProxy>
      </div>
    </main>
  )
}
import { NextProps } from '@/lib/NextProps';
import { client } from '@/lib/prisma';

export default async function GoalPage(props: NextProps) {
  const goals = await client.goal.findMany();

  return (
    <div>
      {goals.map(goal => (
        <div key={goal.id}>
          {goal.id}
        </div>
      ))}
    </div>
  )
}
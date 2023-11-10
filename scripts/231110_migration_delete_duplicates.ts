import { client } from '../src/lib/prisma';

async function main() {
  const transactions = await client.transaction.findMany({
    where: {
      date: {
        lte: new Date(1691853960000),
      },
    },
  });

  for (const transaction of transactions) {
    await client.transaction.delete({
      where: {
        id: transaction.id,
      },
      include: {
        categories: true,
      },
    });
  }
}

main()
  .then(() => { })
  .catch((err) => console.error(err));
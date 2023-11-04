import { loadFromDirectory } from '@/lib/load_transaction';

async function main() {
  const { existed, created } = await loadFromDirectory('banks');

  console.log(`data existed: ${existed}`);
  console.log(`data created: ${created}`);
}

main()
  .then(() => { })
  .catch((err) => console.error(err));
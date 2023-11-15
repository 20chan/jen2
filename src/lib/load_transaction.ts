import xlsx from 'xlsx-populate';
import * as fs from 'fs';
import { client } from './prisma';

function parseDateLike(value: string) {
  return new Date(new Date(value).getTime() - 9 * 60 * 60 * 1000);
}

function parseNumberLike(value: string) {
  return Number(value.replace(/,/g, ''));
}

export async function loadFromDirectory(path: string) {
  let existed = 0;
  let created = 0;

  const creates: number[] = [];

  for (const file of fs.readdirSync(path)) {
    const book = await xlsx.fromFileAsync(`${path}/${file}`, { password: '001003' });
    const sheet = book.sheet(0);

    for (let i = 12; i < sheet._rows.length; i++) {
      const row = sheet.row(i);
      const [
        createdAt,
        amount,
        balance,
        kind,
        content,
      ] = [
          parseDateLike(row.cell(2).value() as string),
          parseNumberLike(row.cell(4).value()?.toString()!),
          parseNumberLike(row.cell(5).value()?.toString()!),
          row.cell(6).value() as string,
          row.cell(7).value() as string,
        ];

      const exist = await client.transaction.findFirst({
        where: {
          createdAt,
          balance,
        },
      });
      if (exist) {
        existed += 1;
        continue;
      }

      const entity = await client.transaction.create({
        data: {
          createdAt,
          date: createdAt,
          amount,
          balance,
          kind,
          content,
          memo: '',
        },
      });

      creates.push(entity.id);
      created += 1;
    }
  }

  return {
    existed,
    created,
    creates,
  }
}
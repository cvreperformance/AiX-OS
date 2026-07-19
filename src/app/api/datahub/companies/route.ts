import { NextResponse } from 'next/server';
import { dataHub } from '../../../../lib/dataHub/DataHub';

export async function GET() {
  const provider = dataHub.get('companies');
  const data = await provider.fetchAll();
  return NextResponse.json(data);
}

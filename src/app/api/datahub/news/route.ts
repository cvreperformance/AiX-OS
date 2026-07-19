import { NextResponse } from 'next/server';
import { dataHub } from '../../../../lib/dataHub/DataHub';

export async function GET() {
  // Prefer the RSS provider if it exists; otherwise fallback to the generic NewsProvider
  let provider;
  try {
    provider = dataHub.get('newsRss');
  } catch {
    provider = dataHub.get('news');
  }
  const data = await provider.fetchAll();
  return NextResponse.json(data);
}

import { notFound } from 'next/navigation';
import Designs from './designs';

export default async function Page({ searchParams }) {
  if (process.env.NODE_ENV === 'production') notFound();
  const { variant } = await searchParams;
  return <Designs variant={['A', 'B', 'C'].includes(variant) ? variant : 'A'} />;
}

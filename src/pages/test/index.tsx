import DatabaseTest from '@/components/test/DatabaseTest';

export default function TestPage() {
  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-4'>System Test Page</h1>
      <DatabaseTest />
    </div>
  );
}

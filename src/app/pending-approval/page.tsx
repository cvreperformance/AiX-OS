import Link from 'next/link';

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900/80 backdrop-blur-xl p-8">
      <div className="max-w-lg w-full rounded-3xl bg-zinc-800/30 border border-zinc-700/50 p-10 text-center backdrop-blur">
        <h1 className="text-3xl font-light text-amber-400 mb-4">Awaiting Approval</h1>
        <p className="text-sm text-zinc-300 mb-6">
          Your account has been created and is pending admin approval. You will receive a Telegram notification once approved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-400 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

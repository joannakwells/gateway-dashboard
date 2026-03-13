import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel mx-auto mt-24 max-w-2xl p-10 text-center">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Not found</p>
      <h2 className="mt-2 text-3xl font-semibold text-bark">This page does not exist</h2>
      <p className="mt-2 text-sm text-stone-600">The item may have been removed or the link may be out of date.</p>
      <Link href="/" className="btn-primary mt-6">Return to dashboard</Link>
    </div>
  );
}

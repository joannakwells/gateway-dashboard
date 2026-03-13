export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="panel h-28 animate-pulse bg-stone-100" />
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="panel h-32 animate-pulse bg-stone-100" />
        <div className="panel h-32 animate-pulse bg-stone-100" />
        <div className="panel h-32 animate-pulse bg-stone-100" />
        <div className="panel h-32 animate-pulse bg-stone-100" />
      </div>
      <div className="panel h-[420px] animate-pulse bg-stone-100" />
    </div>
  );
}

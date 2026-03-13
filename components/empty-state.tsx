export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="panel flex min-h-44 items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-bark">{title}</h3>
        <p className="mt-2 text-sm text-stone-600">{description}</p>
      </div>
    </div>
  );
}

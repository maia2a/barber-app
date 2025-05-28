export const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-solid border-secondary py-2 last:border-b-0">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
)

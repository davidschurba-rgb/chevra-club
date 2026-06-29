type Props = { value: number }

export default function ProgressBar({ value }: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Your progress</span>
        <span>{value}% complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

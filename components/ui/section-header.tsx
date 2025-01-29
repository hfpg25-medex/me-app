interface SectionHeaderProps {
    title: string
    onEdit?: () => void
  }
  
  export function SectionHeader({ title, onEdit }: SectionHeaderProps) {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onEdit && (
          <button onClick={onEdit} className="text-sm text-gray-500 hover:text-gray-700">
            Edit
          </button>
        )}
      </div>
    )
  }
  
  
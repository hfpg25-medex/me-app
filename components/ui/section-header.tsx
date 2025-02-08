// import { Pencil } from "lucide-react"

interface SectionHeaderProps {
  title: string;
  onEdit?: () => void;
  allowEdit?: boolean;
}

export function SectionHeader({
  title,
  onEdit,
  allowEdit = true,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onEdit && allowEdit && (
        <div className="flex items-center">
          {/* <Pencil className="h-3 w-3 text-blue-600 mr-1" /> */}
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-900 border border-blue-600 rounded-md px-2 py-1"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

interface BookOption {
  value: string;
  label: string;
}

interface BookPillsProps {
  options: BookOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  maxSelected?: number;
}

export function BookPills({ options, selected, onChange, maxSelected = 3 }: BookPillsProps) {
  const toggle = (value: string) => {
    const isActive = selected.includes(value);
    if (isActive) {
      onChange(selected.filter((v) => v !== value));
      return;
    }
    if (selected.length >= maxSelected) return;
    onChange([...selected, value]);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`h-8 min-w-[160px] rounded-full border px-1.5 text-sm font-medium shadow-sm transition-colors ${
              active
                ? 'border-gray-300 bg-gray-400 text-yellow-200'
                : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

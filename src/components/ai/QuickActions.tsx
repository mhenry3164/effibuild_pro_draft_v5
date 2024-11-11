import { Button } from '@/components/ui/Button';
import { AI_QUICK_ACTIONS } from '@/config/constants';
import { FileText, Calculator, PieChart } from 'lucide-react';

const ICONS = {
  estimate: FileText,
  materials: Calculator,
  costs: PieChart,
};

interface QuickActionsProps {
  onActionSelect: (actionId: string, prompt: string) => void;
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(AI_QUICK_ACTIONS).map((action) => {
        const Icon = ICONS[action.id as keyof typeof ICONS];
        return (
          <Button
            key={action.id}
            variant="outline"
            onClick={() => onActionSelect(action.id, action.prompt)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
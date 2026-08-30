import { SearchIcon } from "lucide-react";
import { useProjects } from "@/app/providers/projects-context";
import { Input } from "@/shared/ui/kit/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";
import { CreateProjectFormDialog } from "@/features/project";

export function ProjectHeader() {
  const { projectSortStatuses, setProjectStatus } = useProjects();

  return (
    <div className="mb-8">
      <div className="min-w-7xl flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <CreateProjectFormDialog />
      </div>
      <div className="relative flex gap-2">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8 max-w-lg"
        />
        <Select items={projectSortStatuses} defaultValue="all">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {projectSortStatuses.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  onClick={() => setProjectStatus(status.value)}
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

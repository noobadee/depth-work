import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";
import { useProjects } from "@/app/providers/projects-context";

export function SelectStatusControllerField() {
  const { onCreateProject, projectLabelStatuses } = useProjects();

  return (
    <Controller
      control={onCreateProject.control}
      name="status"
      render={({ field, fieldState }) => (
        <>
          <Select
            items={projectLabelStatuses}
            value={field.value}
            onValueChange={field.onChange}
            defaultValue="pending"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {projectLabelStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-xs text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </>
      )}
    />
  );
}

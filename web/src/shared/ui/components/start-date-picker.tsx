import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { ChevronDownIcon } from "lucide-react";
import { useProjects } from "@/app/providers/projects-context";
import { Button } from "@/shared/ui/kit/button";
import { Calendar } from "@/shared/ui/kit/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";

export default function StartDatePicker() {
  const { onCreateProject } = useProjects();

  return (
    <Controller
      control={onCreateProject.control}
      name="startDate"
      render={({ field, fieldState }) => (
        <>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>dd-mm-yyyy</span>
                  )}
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
              }
            />
            <PopoverContent>
              <Calendar
                mode="single"
                selected={field.value ?? undefined}
                onSelect={field.onChange}
                defaultMonth={field.value ?? undefined}
              />
            </PopoverContent>
          </Popover>
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

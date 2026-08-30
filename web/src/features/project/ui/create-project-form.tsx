import { useProjects } from "@/app/providers/projects-context";
import { SelectStatusControllerField } from "@/features/project";
import { Button } from "@/shared/ui/kit/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/kit/dialog";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/kit/field";
import { Input } from "@/shared/ui/kit/input";
import { Textarea } from "@/shared/ui/kit/textarea";
import StartDatePicker from "@/shared/ui/components/start-date-picker";
import DueDatePicker from "@/shared/ui/components/due-date-picker";

export function CreateProjectFormDialog() {
  const {
    openCreateProjectDialog,
    setOpenCreateProjectDialog,
    workspaceName,
    onCreateProject,
  } = useProjects();

  const handleSubmit = onCreateProject.handleSubmit;
  const onSubmit = onCreateProject.onSubmit;
  const register = onCreateProject.register;
  const { errors, isSubmitting } = onCreateProject.formState;

  return (
    <Dialog
      open={openCreateProjectDialog}
      onOpenChange={setOpenCreateProjectDialog}
    >
      <form id="create-project-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger render={<Button />}>New Project</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Create New Project</DialogTitle>
            <DialogDescription>In workspace: {workspaceName}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {/* INPUT FIELD: Project title */}
            <Field>
              <FieldLabel htmlFor="project-name">Project Title</FieldLabel>
              <Input
                {...register("title")}
                id="project-name"
                placeholder="Enter project title"
              />
              {errors.title && (
                <span className="text-xs text-destructive">
                  {errors.title.message}
                </span>
              )}
            </Field>

            {/* INPUT FIELD: Description */}
            <Field>
              <FieldLabel htmlFor="project-description">Description</FieldLabel>
              <Textarea
                {...register("description")}
                id="project-description"
                placeholder="Describe your project"
                className="resize-none"
              />
              {errors.description && (
                <span className="text-destructive">
                  {errors.description.message}
                </span>
              )}
            </Field>

            {/* INPUT FIELD: Select status */}
            <Field>
              <FieldLabel htmlFor="project-status">Status</FieldLabel>
              <SelectStatusControllerField />
            </Field>

            <div className="flex gap-4">
              {/* INPUT FIELD: Start date */}
              <Field>
                <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
                <StartDatePicker />
              </Field>

              {/* INPUT FIELD: Due date */}
              <Field>
                <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
                <DueDatePicker />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              form="create-project-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
          {/* {errors.root && <p className="text-destructive">{errors.root.message}</p>} */}
        </DialogContent>
      </form>
    </Dialog>
  );
}

import { useState } from "react";
import { Check, ChevronLeft, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import { Button } from "@/shared/ui/kit/button";
import { Label } from "@/shared/ui/kit/label";
import { Input } from "@/shared/ui/kit/input";
import type { Dispatch, SetStateAction } from "react";

type Step = 1 | 2;
type WorkspaceType = "personal" | "team" | null;
type SetStep = Dispatch<SetStateAction<Step>>;
type SetWorkspaceType = Dispatch<SetStateAction<WorkspaceType>>;

interface SelectWorkspaceType {
  step: Step;
  setStep: SetStep;
  workspaceType: WorkspaceType;
  setWorkspaceType: SetWorkspaceType;
}

export default function OnboardingCard() {
  const [step, setStep] = useState<1 | 2>(1);
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);

  return (
    <Card className="min-w-sm max-w-md px-4 py-8">
      {step === 1 ? (
        <StepOne
          step={step}
          setStep={setStep}
          workspaceType={workspaceType}
          setWorkspaceType={setWorkspaceType}
        />
      ) : (
        <StepTwo
          step={step}
          setStep={setStep}
          workspaceType={workspaceType}
          setWorkspaceType={setWorkspaceType}
        />
      )}
    </Card>
  );
}

function StepOne({
  step,
  setStep,
  workspaceType,
  setWorkspaceType,
}: SelectWorkspaceType) {
  return (
    <>
      <CardHeader className="flex flex-col items-center mb-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
          Depthwork
        </p>
        <p className="text-xs text-gray-400 mb-4">Step {step} of 2</p>
        <CardTitle className="text-lg">How will you use Depthwork?</CardTitle>
        <p className="text-xs text-gray-500">
          You can create more workspaces later.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            size={null}
            onClick={() => setWorkspaceType("personal")}
            className={`relative cursor-pointer flex flex-col px-4 py-8 gap-2 ${workspaceType === "personal" ? "bg-gray-100 border-gray-700" : ""}`}
          >
            {workspaceType === "personal" ? (
              <Check className="absolute top-0 right-0 m-2 text-gray-700" />
            ) : (
              ""
            )}
            <User className="size-6" />
            <p>Personal</p>
            <p className="text-xs font-normal text-gray-500 whitespace-normal line-clamp-2">
              Track your own projects and tasks
            </p>
          </Button>
          <Button
            variant="outline"
            size={null}
            onClick={() => setWorkspaceType("team")}
            className={`relative cursor-pointer flex flex-col px-4 py-8 gap-2 ${workspaceType === "team" ? "bg-gray-100 border-gray-700" : ""}`}
          >
            {workspaceType === "team" ? (
              <Check className="absolute top-0 right-0 m-2 text-gray-700" />
            ) : (
              ""
            )}
            <Users className="size-6" />
            <p>Team</p>
            <p className="text-xs font-normal text-gray-500 whitespace-normal line-clamp-2">
              Collaborate with teammates on shared work
            </p>
          </Button>
        </div>
        <Button
          onClick={() => setStep(2)}
          className="w-full cursor-pointer"
          disabled={workspaceType === null ? true : false}
        >
          Continue
        </Button>
      </CardContent>
    </>
  );
}

function StepTwo({
  step,
  setStep,
  workspaceType,
  setWorkspaceType,
}: SelectWorkspaceType) {
  const [workspaceName, setWorkspaceName] = useState("");

  return (
    <>
      <ChevronLeft
        onClick={() => setStep(1)}
        className="cursor-pointer text-gray-400"
      />
      <CardHeader className="flex flex-col items-center mb-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
          Depthwork
        </p>
        <p className="text-xs text-gray-400 mb-4">Step {step} of 2</p>
        <CardTitle className="text-lg">Name your workspace</CardTitle>
        <p className="text-xs text-gray-500">
          You can create more workspaces later.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 mb-6">
          <Label htmlFor="workspace-name">Workspace name</Label>
          <Input
            id="workspace-name"
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="e.g., Mark's Workspace"
            required
            autoComplete="workspace-name"
          />
        </div>
        <Button className="w-full">Create workspace</Button>
      </CardContent>
    </>
  );
}

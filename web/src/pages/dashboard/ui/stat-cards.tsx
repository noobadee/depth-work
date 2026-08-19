import { Check, ClipboardList, Folder, TriangleAlert } from "lucide-react";
import { useDashboard } from "@/app/providers/dashboard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";

export function StatCards() {
  const { stats, workspaceName } = useDashboard();

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      description: `projects in ${workspaceName}`,
      icon: Folder,
    },
    {
      title: "Completed Projects",
      value: 0,
      description: `of ${stats.totalProjects} total`,
      icon: Check,
    },
    {
      title: "My Tasks",
      value: stats.myTasks,
      description: "assigned to me",
      icon: ClipboardList,
    },
    {
      title: "Overdue",
      value: 0,
      description: "need attention",
      icon: TriangleAlert,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="min-w-[300px] relative">
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
            <stat.icon className="absolute top-6 right-6" />
          </Card>
        ))}
      </div>
    </div>
  );
}

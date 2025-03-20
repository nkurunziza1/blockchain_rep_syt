import React, { useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../../../components/ui/card";
import { Badge } from "../../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import Loading from "../../../loading";
import { format } from "date-fns";
import Input from "../../../forms/Input";

interface MarkChange {
  courseName: string;
  category: string;
  oldValue: number;
  newValue: number;
}

interface Version {
  versionId: string;
  timestamp: string;
  changedBy: string;
  changeType: "CREATE" | "UPDATE";
  marksState: {
    courses: Array<{
      courseName: string;
      marks: Array<{
        category: string;
        marks: number;
      }>;
    }>;
  };
}

interface MarksHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: Version[];
  filters: {
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filterType: string, date: Date | null) => void;
  isLoading: boolean;
}

export const MarksHistoryDialog: React.FC<MarksHistoryDialogProps> = ({
  isOpen,
  onClose,
  history,
  filters,
  onFilterChange,
  isLoading,
}) => {
  const processedHistory = useMemo(() => {
    return history.map((version, index) => {
      const changes: MarkChange[] = [];

      // For updates, compare with previous version
      if (index < history.length - 1 && version.changeType === "UPDATE") {
        const prevVersion = history[index + 1];

        version.marksState.courses.forEach((course) => {
          course.marks.forEach((mark) => {
            const prevCourse = prevVersion.marksState.courses.find(
              (c) => c.courseName === course.courseName
            );
            const prevMark = prevCourse?.marks.find(
              (m) => m.category === mark.category
            );

            if (prevMark && prevMark.marks !== mark.marks) {
              changes.push({
                courseName: course.courseName,
                category: mark.category,
                oldValue: prevMark.marks,
                newValue: mark.marks,
              });
            }
          });
        });
      }
      // For create, show initial values
      else if (version.changeType === "CREATE") {
        version.marksState.courses.forEach((course) => {
          course.marks.forEach((mark) => {
            changes.push({
              courseName: course.courseName,
              category: mark.category,
              oldValue: 0,
              newValue: mark.marks,
            });
          });
        });
      }

      return {
        ...version,
        changes,
      };
    });
  }, [history]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Marks History</DialogTitle>
          <DialogDescription>
            Track all changes made to student marks over time
          </DialogDescription>
        </DialogHeader>

        <div className="flex z-50 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <Input
            type="date"
            value={
              filters.startDate
                ? new Date(filters.startDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              onFilterChange(
                "startDate",
                e.target.value ? new Date(e.target.value) : null
              )
            }
            placeholder="Start Date"
            className="w-40"
          />
          <Input
            type="date"
            value={
              filters.endDate
                ? new Date(filters.endDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              onFilterChange(
                "endDate",
                e.target.value ? new Date(e.target.value) : null
              )
            }
            placeholder="End Date"
            className="w-40"
          />
          <Button
            variant="default"
            onClick={() => onFilterChange("apply", null)}
          >
            Apply Filter
          </Button>
          <Button
            variant="outline"
            onClick={() => onFilterChange("reset", null)}
          >
            Reset
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : (
          <div className="space-y-4">
            {processedHistory.map((version, index) => (
              <Card key={version.versionId}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">
                        Changed on {format(new Date(version.timestamp), "PPP")}{" "}
                        at {format(new Date(version.timestamp), "pp")}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        by {version.changedBy}
                      </span>
                    </div>
                    <Badge
                      variant={
                        version.changeType === "UPDATE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {version.changeType}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Category</TableHead>

                        <TableHead className="text-right">
                          {version.changeType == "CREATE"
                            ? "Initial state"
                            : "Previous Mark"}
                        </TableHead>

                        {version.changeType != "CREATE" && (
                          <TableHead className="text-right">New Mark</TableHead>
                        )}
                        {version.changeType != "CREATE" && (
                          <TableHead className="text-right">Change</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {version.changes.map((change, changeIndex) => (
                        <TableRow key={changeIndex}>
                          <TableCell>{change.courseName}</TableCell>
                          <TableCell>{change.category}</TableCell>
                          <TableCell className="text-right">
                            {change.newValue || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {change.oldValue}
                          </TableCell>
                          {version.changeType != "CREATE" && (
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {change.oldValue > change.newValue ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                  className={cn(
                                    "text-sm font-medium",
                                    change.oldValue > change.newValue
                                      ? "text-green-600"
                                      : "text-red-600"
                                  )}
                                >
                                  {Math.abs(change.newValue - change.oldValue)}
                                </span>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

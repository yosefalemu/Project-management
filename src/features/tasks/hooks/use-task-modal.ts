import { useQueryState, parseAsBoolean, parseAsStringEnum } from "nuqs";
import { TaskStatus } from "../constant/types";

export const useTaskModalHook = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const [taskStatus, setTaskStatus] = useQueryState(
    "task-status",
    parseAsStringEnum<TaskStatus>(Object.values(TaskStatus))
      .withDefault(TaskStatus.BACKLOG)
      .withOptions({ clearOnDefault: true })
  );

  const open = (status: TaskStatus = TaskStatus.BACKLOG) => {
    setIsOpen(true);
    setTaskStatus(status);
  };

  const close = () => {
    setIsOpen(false);
    setTaskStatus(null);
  };

  return { isOpen, taskStatus, open, close, setTaskStatus, setIsOpen };
};

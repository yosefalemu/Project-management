import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    assigneedId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
    status: parseAsStringEnum([
      "BACKLOG",
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "DONE",
    ]),
  });
};

import { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "../constant/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

interface DataKanbanProps {
  data: Task[];
  onChange: (
    tasks: { id: string; status: TaskStatus; position: number }[]
  ) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type taskState = {
  [key in TaskStatus]: Task[];
};
export default function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = useState(() => {
    const initialTasks: taskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => initialTasks[task.status].push(task));
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => parseInt(a.position) - parseInt(b.position)
      );
    });
    return initialTasks;
  });

  useEffect(() => {
    const newTasks: taskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => newTasks[task.status].push(task));
    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort(
        (a, b) => parseInt(a.position) - parseInt(b.position)
      );
    });
    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;
      let updatesPayloads: {
        id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks((prevTask) => {
        const newTasks = { ...prevTask };
        // Remove the task from the source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);
        if (!movedTask) {
          return prevTask;
        }

        // Update the source column tasks' positions
        const updatedSourceColumn = sourceColumn.map((task, index) => ({
          ...task,
          position: index.toString(),
        }));
        newTasks[sourceStatus] = updatedSourceColumn;

        // Prepare the moved task with updated status if necessary
        const updateTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        // Insert into destination column
        const destinationColumn = [...newTasks[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updateTask);

        // Update destination column tasks' positions
        const updatedDestinationColumn = destinationColumn.map(
          (task, index) => ({
            ...task,
            position: index.toString(),
          })
        );
        newTasks[destinationStatus] = updatedDestinationColumn;

        // Generate updatesPayloads for all affected tasks
        updatesPayloads = [];

        // If source and destination are different, include source column tasks
        if (sourceStatus !== destinationStatus) {
          updatedSourceColumn.forEach((task, index) => {
            updatesPayloads.push({
              id: task.id,
              status: sourceStatus,
              position: index,
            });
          });
        }

        // Include all destination column tasks
        updatedDestinationColumn.forEach((task, index) => {
          updatesPayloads.push({
            id: task.id,
            status: destinationStatus,
            position: index,
          });
        });
        return newTasks;
      });
      onChange(updatesPayloads);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-shrink-0 mx-2 bg-muted p-1.5 rounded-md min-w-[350px]"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[550px] py-1.5 hide-scrollbar"
                >
                  {tasks[board].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

import { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { COLUMNS } from '../data/initialData';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

export default function KanbanBoard({ project, onUpdate }) {
  const [activeTask, setActiveTask] = useState(null);
  const [modalTask, setModalTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const tasksByColumn = (col) => project.tasks.filter((t) => t.column === col);

  const findTaskColumn = (id) => project.tasks.find((t) => t.id === id)?.column;

  const handleDragStart = ({ active }) => {
    setActiveTask(project.tasks.find((t) => t.id === active.id) || null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeCol = findTaskColumn(active.id);
    const overCol = COLUMNS.includes(over.id) ? over.id : findTaskColumn(over.id);
    if (!activeCol || !overCol || activeCol === overCol) return;

    const updated = project.tasks.map((t) =>
      t.id === active.id ? { ...t, column: overCol } : t
    );
    onUpdate({ ...project, tasks: updated });
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const activeCol = findTaskColumn(active.id);
    const overCol = COLUMNS.includes(over.id) ? over.id : findTaskColumn(over.id);
    if (!activeCol || !overCol) return;

    if (activeCol === overCol && active.id !== over.id) {
      const colTasks = tasksByColumn(activeCol);
      const oldIndex = colTasks.findIndex((t) => t.id === active.id);
      const newIndex = colTasks.findIndex((t) => t.id === over.id);
      const reordered = arrayMove(colTasks, oldIndex, newIndex);
      const updated = project.tasks.filter((t) => t.column !== activeCol).concat(reordered);
      onUpdate({ ...project, tasks: updated });
    }
  };

  const openNewTask = (column) => {
    setModalTask({ title: '', description: '', priority: 'Medium', column, assignee: '', dueDate: '', labels: [] });
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setModalTask(task);
    setModalOpen(true);
  };

  const handleSave = (form) => {
    if (form.id) {
      const updated = project.tasks.map((t) => (t.id === form.id ? { ...form } : t));
      onUpdate({ ...project, tasks: updated });
    } else {
      onUpdate({ ...project, tasks: [...project.tasks, { ...form, id: uuidv4() }] });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    onUpdate({ ...project, tasks: project.tasks.filter((t) => t.id !== id) });
    setModalOpen(false);
  };

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns-container">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col}
              column={col}
              tasks={tasksByColumn(col)}
              projectColor={project.color}
              onCardClick={openEditTask}
              onAddTask={openNewTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} projectColor={project.color} onClick={() => {}} />
          )}
        </DragOverlay>
      </DndContext>

      {modalOpen && (
        <TaskModal
          task={modalTask}
          projectColor={project.color}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

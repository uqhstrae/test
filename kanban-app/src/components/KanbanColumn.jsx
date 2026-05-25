import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COLUMN_COLORS = {
  Backlog: '#94a3b8',
  'To Do': '#60a5fa',
  'In Progress': '#f59e0b',
  'In Review': '#a78bfa',
  Done: '#34d399',
};

export default function KanbanColumn({ column, tasks, projectColor, onCardClick, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column });

  return (
    <div className={`kanban-column ${isOver ? 'column-over' : ''}`}>
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-dot" style={{ background: COLUMN_COLORS[column] || '#94a3b8' }} />
          <h3 className="column-title">{column}</h3>
          <span className="column-count">{tasks.length}</span>
        </div>
        <button className="add-task-btn" onClick={() => onAddTask(column)} title="Add task">
          +
        </button>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="column-tasks">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectColor={projectColor}
              onClick={() => onCardClick(task)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="empty-column">Drop tasks here</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

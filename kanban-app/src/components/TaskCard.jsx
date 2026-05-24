import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PRIORITY_COLORS = {
  High: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
  Medium: { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' },
  Low: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
};

export default function TaskCard({ task, projectColor, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      onClick={onClick}
    >
      <div className="task-card-header">
        <div className="task-labels">
          {task.labels.map((label) => (
            <span key={label} className="task-label" style={{ borderLeft: `3px solid ${projectColor}` }}>
              {label}
            </span>
          ))}
        </div>
        <span
          className="task-priority"
          style={{ background: priority.bg, color: priority.text }}
        >
          <span className="priority-dot" style={{ background: priority.dot }} />
          {task.priority}
        </span>
      </div>
      <p className="task-title">{task.title}</p>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-footer">
        {task.dueDate && (
          <span className="task-due">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {task.dueDate}
          </span>
        )}
        {task.assignee && (
          <span className="task-assignee">
            {task.assignee.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

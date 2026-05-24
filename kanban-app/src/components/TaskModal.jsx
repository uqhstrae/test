import { useState, useEffect } from 'react';
import { COLUMNS } from '../data/initialData';

const PRIORITIES = ['High', 'Medium', 'Low'];

export default function TaskModal({ task, projectColor, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    column: 'To Do',
    assignee: '',
    dueDate: '',
    labels: [],
  });
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    if (task) setForm({ ...task });
  }, [task]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !form.labels.includes(trimmed)) {
      handleChange('labels', [...form.labels, trimmed]);
    }
    setLabelInput('');
  };

  const removeLabel = (label) => handleChange('labels', form.labels.filter((l) => l !== label));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderTop: `4px solid ${projectColor}` }}>
          <h2 className="modal-title">{task?.id ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input form-textarea"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-input"
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-input"
                value={form.column}
                onChange={(e) => handleChange('column', e.target.value)}
              >
                {COLUMNS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Assignee</label>
              <input
                className="form-input"
                value={form.assignee}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Labels</label>
            <div className="label-input-row">
              <input
                className="form-input"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                placeholder="Add label, press Enter"
              />
              <button type="button" className="btn-secondary" onClick={addLabel}>Add</button>
            </div>
            <div className="label-chips">
              {form.labels.map((label) => (
                <span key={label} className="label-chip" style={{ borderLeft: `3px solid ${projectColor}` }}>
                  {label}
                  <button type="button" className="chip-remove" onClick={() => removeLabel(label)}>✕</button>
                </span>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            {task?.id && (
              <button type="button" className="btn-danger" onClick={() => onDelete(task.id)}>
                Delete
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ background: projectColor }}>
                {task?.id ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

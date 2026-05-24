import { useState } from 'react';
import { initialProjects } from './data/initialData';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

export default function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(initialProjects[0].id);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleProjectUpdate = (updated) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const doneTasks = (project) => project.tasks.filter((t) => t.column === 'Done').length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">K</div>
          <span className="brand-name">KanbanFlow</span>
        </div>
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Projects</p>
          {projects.map((project) => (
            <button
              key={project.id}
              className={`sidebar-project-btn ${activeProjectId === project.id ? 'active' : ''}`}
              style={{ '--project-color': project.color }}
              onClick={() => setActiveProjectId(project.id)}
            >
              <span className="project-dot" style={{ background: project.color }} />
              <span className="project-nav-title">{project.title}</span>
              <span className="project-nav-count">
                {doneTasks(project)}/{project.tasks.length}
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">H</div>
          <div className="user-info">
            <span className="user-name">Henry</span>
            <span className="user-role">Project Owner</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="app-header">
          <div className="header-left">
            <span className="project-badge" style={{ background: activeProject.color }} />
            <div>
              <h1 className="project-title">{activeProject.title}</h1>
              <p className="project-subtitle">
                {activeProject.tasks.length} tasks &nbsp;·&nbsp;{' '}
                {activeProject.tasks.filter((t) => t.column === 'Done').length} completed
              </p>
            </div>
          </div>
          <div className="header-stats">
            {['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'].map((col) => (
              <div key={col} className="stat-chip">
                <span className="stat-label">{col}</span>
                <span className="stat-value">
                  {activeProject.tasks.filter((t) => t.column === col).length}
                </span>
              </div>
            ))}
          </div>
        </header>

        <KanbanBoard project={activeProject} onUpdate={handleProjectUpdate} />
      </main>
    </div>
  );
}

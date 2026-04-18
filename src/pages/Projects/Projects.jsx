import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { projectsAPI } from "../../services/api";
import { Plus, Folder, Trash2, Edit } from "lucide-react";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6"
  });

  const colorOptions = [
    "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#06b6d4", "#64748b"
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const data = await projectsAPI.getAll();
      setProjects(data.projects);
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  async function createProject(e) {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, formData);
      } else {
        await projectsAPI.create(formData);
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      console.error("Failed to save project");
    }
  }

  async function deleteProject(id) {
    if (!confirm("Are you sure you want to delete this project? Tasks will not be deleted.")) return;
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project");
    }
  }

  function openModal(project = null) {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || "",
        color: project.color
      });
    } else {
      setEditingProject(null);
      setFormData({ name: "", description: "", color: "#3b82f6" });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProject(null);
    setFormData({ name: "", description: "", color: "#3b82f6" });
  }

  return (
    <div className="projects-page">
      <Sidebar />
      <div className="projects-content">
        <div className="projects-header">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Organize your tasks into projects</p>
          </div>
          <button className="add-project-btn" onClick={() => openModal()}>
            <Plus size={20} />
            New Project
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <Folder size={48} />
            <h3>No projects yet</h3>
            <p>Create your first project to organize tasks</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div 
                key={project.id} 
                className="project-card"
                style={{ borderTopColor: project.color }}
              >
                <div className="project-header">
                  <div 
                    className="project-icon"
                    style={{ backgroundColor: project.color + "20", color: project.color }}
                  >
                    <Folder size={24} />
                  </div>
                  <div className="project-actions">
                    <button 
                      className="icon-btn edit"
                      onClick={() => openModal(project)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="project-name">{project.name}</h3>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
                <div className="project-stats">
                  <span className="stat">{project.task_count} tasks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProject ? "Edit Project" : "New Project"}</h2>
            <form onSubmit={createProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProject ? "Update" : "Create"} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

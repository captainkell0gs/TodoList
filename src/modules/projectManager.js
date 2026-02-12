export default class ProjectManager {
    projects = [];

    addProject(project) {
        this.projects.push(project);
    }

    removeProject(id) {
        const index = this.projects.findIndex(b => b.id === id);
        if (index !== -1) {
            this.projects.splice(index, 1);
        }
    }

    editProject(id, name) {
        const project = this.projects.find(b => b.id === id);
        if (project) {
            project.edit(name);
            return true;
        }
        return false;
    }

    getProject(id) {
        return this.projects.find(b => b.id === id);
    }

    getProjects() {
        return this.projects;
    }

    count() {
        return this.projects.length;
    }
}
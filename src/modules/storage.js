import ProjectManager from "./projectManager.js";
import Project from "./project.js";
import Todo from "./todo.js";

class Storage {
    save(projectManager) {
        localStorage.setItem("todoData", JSON.stringify(projectManager));
    }

    load() {
        const data = localStorage.getItem("todoData");
        if (!data) return null;

        const parsed = JSON.parse(data);
        if (!parsed.projects) return null;

        const manager = new ProjectManager();
        
        parsed.projects.forEach(projectData => {
            if(!Array.isArray(projectData.todos)) return;

            const project = new Project(projectData.name);

            projectData.todos.forEach(todoData => {
                const todo = new Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority
                );
                todo.completed = todoData.completed ?? false;
                todo.id = todoData.id;
                todo.dueDate = new Date(todoData.dueDate) ?
                new Date(todoData.dueDate) : null;

                project.addTodo(todo);
            });

            project.id = projectData.id;
            manager.addProject(project);
        });

        return manager;
    }

    init() {
        let manager = this.load();

        if (!manager) {
            manager = new ProjectManager();
            manager.addProject(new Project("Default Project"));
            this.save(manager);
        }
        return manager
    }
}

const storage = new Storage();
export default storage;
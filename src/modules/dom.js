import Storage from "./storage.js";
import Project from "./project.js";
import Todo from "./todo.js";

class Dom {
    constructor() {
        this.manager = null;
        this.currentProject = null;
        this.editingTodo = null;
        
        this.elements = {
            projectList: document.getElementById("project-list"),
            addProjectBtn: document.getElementById("add-project-btn"),

            projectTitle: document.getElementById("project-title"),
            addTodoBtn: document.getElementById("add-todo-btn"),
            todoListSection: document.getElementById("todo-list-section"),

            projectModal: document.getElementById("project-modal"),
            projectForm: document.getElementById("project-form"),
            projectNameInput: document.getElementById("project-name-input"),
            projectSubmitBtn: document.getElementById("project-submit-btn"),
            projectTemplate: document.getElementById("project-item-template"),

            todoModal: document.getElementById("todo-modal"),
            todoForm: document.getElementById("todo-form"),
            todoTitleInput: document.getElementById("todo-title-input"),
            todoDescriptionInput: document.getElementById("todo-description-input"),
            todoDateInput: document.getElementById("todo-date-input"),
            todoPriorityInput: document.getElementById("todo-priority-input"),
            todoSubmitBtn: document.getElementById("todo-submit-btn"),
            todoTemplate: document.getElementById("todo-item-template"),
        };

    };

    init() {
        this.manager = Storage.init();
        this.currentProject = this.manager.getProjects()[0];
        if (!this.currentProject) {
            this.currentProject = new Project("Default Project");
            this.manager.addProject(this.currentProject);
        };
        Storage.save(this.manager);

        this.renderProjectList();
        this.renderTodoList();
        this.renderProjectTitle();

        this.bindEventListeners();
    };

    renderProjectList() {
        const list = this.elements.projectList;
        list.innerHTML = ""; // clear old list

        const projects = this.manager.getProjects();
        const template = this.elements.projectTemplate;

        projects.forEach((project) => {
            const clone = template.content.cloneNode(true);
            const item = clone.querySelector(".project-item");

            item.dataset.id = project.id;

            const name = clone.querySelector(".project-name");
            name.textContent = project.name;

            if (project === this.currentProject) {
                item.classList.add("active");
            }

            list.appendChild(clone);
        });

    };

    renderProjectTitle() {
        this.elements.projectTitle.textContent = this.currentProject.name;
    }

    renderTodoList() {
        const section = this.elements.todoListSection;
        section.innerHTML = "";

        const template = this.elements.todoTemplate;

        this.currentProject.getTodos().forEach(todo => {
            const clone = template.content.cloneNode(true);
            const item = clone.querySelector(".todo-item");

            item.dataset.id = todo.id;

            const checkbox = clone.querySelector(".todo-checkbox");
            const title = clone.querySelector(".todo-title");

            const description = clone.querySelector(".todo-description");
            const dueDate = clone.querySelector(".todo-date");
            const priority = clone.querySelector(".todo-priority");
            const overdueBadge = clone.querySelector(".overdue-badge");
            checkbox.checked = todo.completed;
            title.textContent = todo.title;

            description.textContent = todo.description || "No description";
            dueDate.textContent = todo.dueDate ? `Due: ${todo.dueDate}` : "No due date";
            priority.textContent = `Priority: ${todo.priority}`;    

            item.classList.add(`priority-${todo.priority}`);

            if (todo.completed) item.classList.add("completed");
            if (todo.isOverdue()) {
                item.classList.add("overdue");
                overdueBadge.classList.remove("hidden");
            }

            section.appendChild(clone);
        });
    }

    bindProjectEvents() {
        this.elements.addProjectBtn.addEventListener("click", () => {
            this.elements.projectModal.showModal();
        });

        this.elements.projectSubmitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const name = this.elements.projectNameInput.value.trim();
            if (!name) return;

            const project = new Project(name);
            this.manager.addProject(project);
            Storage.save(this.manager);

            this.currentProject = project;

            this.renderProjectList();
            this.renderProjectTitle();
            this.renderTodoList();

            this.elements.projectForm.reset();
            this.elements.projectModal.close();
        });
    };

    bindTodoEvents() {
        this.elements.addTodoBtn.addEventListener("click", () => {
            this.elements.todoModal.showModal();
        });

        this.elements.todoSubmitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const title = this.elements.todoTitleInput.value.trim();
            if (!title) return;

            const description = this.elements.todoDescriptionInput.value.trim();
            const dueDate = this.elements.todoDateInput.value;
            const priority = this.elements.todoPriorityInput.value;

            const todo = new Todo(title, description, dueDate, priority);
            this.currentProject.addTodo(todo);
            Storage.save(this.manager);

            
            this.renderTodoList();

            this.elements.todoForm.reset();
            this.elements.todoModal.close();
        });
    };

    bindProjectItemEvents() {
        this.elements.projectList.addEventListener("click", (e) => {
            const item = e.target.closest(".project-item");
            if (!item) return;

            const projectId = item.dataset.id;
            const project = this.manager.getProject(projectId);
            if (!project) return;

            if (e.target.classList.contains("project-menu-btn")) {
                e.stopPropagation();
                e.target.nextElementSibling.classList.toggle("hidden");
                return;
            }

            // DELETE
            if (e.target.classList.contains("delete-project")) {
                if (!confirm("Delete this project?")) return;

                this.manager.removeProject(projectId);

                if (this.currentProject.id === projectId) {
                    const fallback = this.manager.getProjects()[0];
                    this.currentProject = fallback || null;
                }

                Storage.save(this.manager);
                this.renderProjectList();
                this.renderProjectTitle();
                this.renderTodoList();
                return;
            }

            // RENAME
            if (e.target.classList.contains("rename-project")) {
                const newName = prompt("Rename project:", project.name);
                if (!newName || !newName.trim()) return;

                project.edit(newName.trim());

                Storage.save(this.manager);
                this.renderProjectList();
                this.renderProjectTitle();
            }

            // SELECT PROJECT
            if (!e.target.closest(".project-actions")) {
                this.currentProject = project;
                this.renderProjectList();
                this.renderProjectTitle();
                this.renderTodoList();
            }
        });

            // CLOSE MENUS ON OUTSIDE CLICK
            document.addEventListener("click", (e) => {
                if (!e.target.closest(".project-actions")) {
                    document.querySelectorAll(".project-menu").forEach(menu =>
                        menu.classList.add("hidden")
                    );
                }
            });
    }

    bindTodoItemEvents() {
        this.elements.todoListSection.addEventListener("click", (e) => {
            const item = e.target.closest(".todo-item");
            if (!item) return;

            const todoId = item.dataset.id;
            const todo = this.currentProject.getTodos().find(t => t.id === todoId);
            if (!todo) return;

            // MENU TOGGLE
            if (e.target.classList.contains("todo-menu-btn")) {
                const menu = e.target.nextElementSibling;
                menu.classList.toggle("hidden");
                return;
            }

            // MENU ACTIONS: DELETE & EDIT
            if (e.target.classList.contains("delete-btn")) {
                this.currentProject.removeTodo(todoId);
                Storage.save(this.manager);
                this.renderTodoList();
                return;
            }

            if (e.target.classList.contains("edit-btn")) {
                this.editingTodo = todo;

                this.elements.todoTitleInput.value = todo.title;
                this.elements.todoDescriptionInput.value = todo.description;
                this.elements.todoDateInput.value = todo.dueDate;
                this.elements.todoPriorityInput.value = todo.priority;

                this.elements.todoModal.showModal();
                return;
            }

            // TOGGLE COMPLETE
            if (e.target.classList.contains("todo-checkbox")) {
                todo.toggleComplete();
                Storage.save(this.manager);
                this.renderTodoList();
                return;
            }

            //DEFAULT: TOGGLE DETAILS 
            if (
                !e.target.closest(".menu") &&
                !e.target.classList.contains("todo-menu-btn")
            ) {
                const details = item.querySelector(".todo-details");
                details.classList.toggle("hidden");
            }
        });

        // CLOSE MENUS ON OUTSIDE CLICK
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".todo-actions")) {
                document.querySelectorAll(".todo-menu").forEach(menu =>
                    menu.classList.add("hidden")
                );
            }
        });
    }

    bindKeyboardEvents() {
        document.addEventListener("keydown", (e) => {
            const todoModalOpen = this.elements.todoModal.open;
            const projectModalOpen = this.elements.projectModal.open;

            // Close modals on Escape
            if (e.key === "Escape") {
                if (todoModalOpen) this.elements.todoModal.close(); 
                if (projectModalOpen) this.elements.projectModal.close();
                return;
            }
            
            // Submit forms on Enter
            if (e.key === "Enter") {
                if (todoModalOpen) {
                    e.preventDefault();
                    this.elements.todoSubmitBtn.click();
                    return;
                }

                if (projectModalOpen) {
                    e.preventDefault();
                    this.elements.projectSubmitBtn.click();
                    return;
                }
            }

        })
    }

    bindEventListeners() {
        this.bindProjectEvents();
        this.bindTodoEvents();
        this.bindProjectItemEvents();
        this.bindKeyboardEvents();
        this.bindTodoItemEvents();
    };

};

export default Dom;
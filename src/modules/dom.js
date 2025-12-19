import Storage from "./storage.js";
import Project from "./project.js";
import Todo from "./todo.js";

class Dom {
    constructor() {
        this.manager = null;
        this.currentProject = null;
        
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

            todoModal: document.getElementById("todo-modal"),
            todoForm: document.getElementById("todo-form"),
            todoTitleInput: document.getElementById("todo-title-input"),
            todoDescriptionInput: document.getElementById("todo-description-input"),
            todoDateInput: document.getElementById("todo-date-input"),
            todoPriorityInput: document.getElementById("todo-priority-input"),
            todoSubmitBtn: document.getElementById("todo-submit-btn"),
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

        projects.forEach((project) => {
            const item = document.createElement("li");
            item.classList.add("project-item");
            item.textContent = project.name;

            if (project === this.currentProject) {
                item.classList.add("active");
            }

            item.addEventListener("click", () => {
                this.currentProject = project;
                this.renderProjectList();
                this.renderTodoList();
                this.renderProjectTitle();
                
            });

            list.appendChild(item);
        });
    };

    renderProjectTitle() {
        this.elements.projectTitle.textContent = this.currentProject.name;
    }

    renderTodoList() {
        const section = this.elements.todoListSection;
        section.innerHTML = ""; 
        const todos = this.currentProject.getTodos();

        todos.forEach((todo) => {
            const item = document.createElement("div");
            item.classList.add("todo-item");
            item.textContent = todo.title;

            if (todo.completed) {
                item.classList.add("completed");
            }

            item.dataset.id = todo.id;

            section.appendChild(item);
        });

        this.bindTodoItemEvents();
    };

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

    bindTodoItemEvents(){
        const items = this.elements.todoListSection.querySelectorAll(".todo-item");

        items.forEach((item) => {
            item.addEventListener("click", () => {
                const todoId = item.dataset.id;
                const todo = this.currentProject
                    .getTodos()
                    .find(t => t.id === todoId);

                if (!todo) return;
                
                todo.toggleComplete();
                Storage.save(this.manager);
                this.renderTodoList();
            })
        })
    };

    bindEventListeners() {
        this.bindProjectEvents();
        this.bindTodoEvents();
    };

};

export default Dom;
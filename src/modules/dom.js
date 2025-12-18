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

    }

    init() {
        this.manager = Storage.init();
        this.currentProject = this.manager.getProjects()[0];
        if (!this.currentProject) {
            this.currentProject = this.manager.createProject("Default Project");
        };
        this.renderProjectList();
        this.renderTodoList();

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

            item.dataset.id = todo.id;

            section.appendChild(item);
        });
    };

};
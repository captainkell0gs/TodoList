import Todo from './todo.js';

export default class Project {
    constructor(name, todos = []) {
        this.name = name;
        this.todos = todos;
        this.id = crypto.randomUUID();
    }

    addTodo(todo) {
        if(todo instanceof Todo) this.todos.push(todo);
    }

    removeTodo(id) {
        const index = this.todos.findIndex(b => b.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }

    edit(name) {
        this.name = name;
    }

    getTodos() {
        return this.todos;
    }
}
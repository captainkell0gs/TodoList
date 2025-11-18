export default class Todo {
    constructor(title, description, dueDate, priority){ 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.notes = "";
        this.checklist = [];
        this.id = crypto.randomUUID();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    edit(title, description, dueDate, priority, notes) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
    }

    isOverdue() {
        if (this.completed) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        const due = new Date(this.dueDate);
        due.setHours(0, 0, 0, 0); // Normalize to midnight

        return due < today;
    }
}
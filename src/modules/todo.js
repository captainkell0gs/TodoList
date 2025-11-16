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
        const today = new Date();
        const due = new Date(this.dueDate);
        if (today > due && !this.completed) {
            return true;
        }else {return false;}
    }
}
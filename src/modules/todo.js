import { isBefore, startOfDay } from 'date-fns';
import { format } from 'date-fns';

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
        if (!this.dueDate) return false;
        return isBefore(startOfDay(this.dueDate), startOfDay(new Date()));
    }

    formattedDueDate() {
        if (!this.dueDate) return "No due date";
        return format(this.dueDate, 'eeee, MMMM do, yyyy');
    }
}
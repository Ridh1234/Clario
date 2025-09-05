import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ToDo } from '../../todo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-todo',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-todo.html',
  styleUrl: './add-todo.css'
})
export class AddTodo implements OnInit{
  title: string = '';
  desc: string = '';
  category: string = 'Personal';
  categories: string[] = ['Work', 'Personal', 'Study', 'Today', 'This Week'];
  showExpandedForm: boolean = false;
  selectedDueDate: string = '';
  
  @Output() todoAdd: EventEmitter<ToDo> = new EventEmitter();
  @ViewChild('titleInput') titleInput!: ElementRef;

  constructor(){

  }


  ngOnInit(): void {
      
  }
  
  onSubmit(){
    if (!this.title?.trim()) {
      return;
    }
    
    const todo = new ToDo(
      0, // sno will be set in the parent component
      this.title.trim(),
      this.desc?.trim() || '',
      true,
      this.category
    );
    this.todoAdd.emit(todo);
    this.resetForm();
  }
  
  toggleExpandedForm(): void {
    this.showExpandedForm = !this.showExpandedForm;
    if (this.showExpandedForm) {
      // Focus on title input when expanding
      setTimeout(() => {
        if (this.titleInput) {
          this.titleInput.nativeElement.focus();
        }
      }, 100);
    }
  }
  
  cancelExpanded(): void {
    this.showExpandedForm = false;
    this.resetForm();
  }
  
  setDueDate(dateOption: string): void {
    this.selectedDueDate = dateOption;
    // You can implement actual due date logic here
    // For now, we'll just update the category based on selection
    if (dateOption === 'today') {
      this.category = 'Today';
    } else if (dateOption === 'week') {
      this.category = 'This Week';
    }
  }
  
  private resetForm(): void {
    this.title = '';
    this.desc = '';
    this.category = 'Personal';
    this.selectedDueDate = '';
  }
}

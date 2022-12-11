import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  taskForm!: FormGroup<any>;
  itemList: any[] = [];
  taskItems: any[] = [];

  inTodo: any[] = [];
  inProgress: any[] = [];
  inDone: any[] = [];

  taskModel: any;

  task: any;

  constructor(private modalService: NgbModal) {
  }

  public open(modal: any, taskItem: any): void {

    if(taskItem){
      this.setFormValue(taskItem);
    }else {
      this.taskForm.reset();
    }

    this.modalService.open(modal);
  }

  ngOnInit() {
    this.itemList = [];
    this.taskForm = new FormGroup({
      id: new FormControl(Math.floor(Math.random() * 100)),
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(150),
      ]),
      priority: new FormControl('', [
        Validators.required
      ]),
      startDate: new FormControl('', [
        Validators.required
      ]),
      endDate: new FormControl('', [
        Validators.required
      ]),
      status: new FormControl('', [
        Validators.required
      ]),
      assignedPerson: new FormControl('', [
        Validators.required
      ]),
      attachment: new FormControl(''),
      subtask: new FormControl(''),
    });
    this.getItems();
  }


  get f() {
    return this.taskForm.controls;
  }

  submit() {
      this.task = JSON.stringify(this.taskForm.value);
      localStorage.setItem('itemList', this.task);
      this.taskForm.reset();
      this.getTaskItems();
  }

  update(id: any){
    const taskItem = localStorage.getItem('itemList');
    if (taskItem != null) {
      let list = JSON.parse(taskItem);
      console.log(list);
      for(var i = 0; i < list.length; i++) {
        if(list[i].id == id) {
          list.splice(i, 1);
        }
      }
      list.push(taskItem);
      localStorage.setItem('itemList', JSON.stringify(list));
      this.modalService.dismissAll();
      this.getItems();
    }
  }

  getTaskItems() {
    const taskItem = localStorage.getItem('itemList');

    if (taskItem && taskItem != 'undefined') {
      this.itemList.push(JSON.parse(taskItem));
      this.itemList.unshift(this.task);
      localStorage.setItem('itemList', JSON.stringify(this.itemList));
      this.modalService.dismissAll();
      this.getItems();
    } else {
      localStorage.setItem('itemList', this.task);
      this.modalService.dismissAll();
      this.getItems();
    }
  }

  getItems() {
    const taskItem = localStorage.getItem('itemList');
    console.log(taskItem);
    if (taskItem) {
      this.taskItems = JSON.parse(taskItem);
      this.taskItems.filter((item) => {
        if(item.status == 'in-progress'){
          this.inProgress.push(item);
        }
        if(item.status == 'todo'){
          this.inTodo.push(item);
        }
        if(item.status == 'done'){
          this.inDone.push(item);
        }
      })
    }
  }

  setFormValue(value: any) {
    console.log(value);
    this.f['id'].patchValue(value.id);
    this.f['title'].patchValue(value.title);
    this.f['description'].patchValue(value.description);
    this.f['priority'].patchValue(value.priority);
    this.f['startDate'].patchValue(value.startDate);
    this.f['endDate'].patchValue(value.endDate);
    this.f['status'].patchValue(value.status);
    this.f['assignedPerson'].patchValue(value.assignedPerson);
    this.f['attachment'].patchValue(value.attachment);
    this.f['subtask'].patchValue(value.subtask);
    this.taskModel = value;
  }

}

import { TaskState } from './../models/task-state';
import { Task } from './../models/task';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  panelOpenState = false;
  taskList: Task[];
  displayedColumns: string[] = ['tasks', 'actions',];
  

  constructor(protected _http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this._http.get<Task[]>(environment.apiUrl + '/tasks').subscribe(res => {
      this.taskList = res.sort((a, b) => (a.id < b.id) ? 1 : -1);
    })
  }

  save(task: Task) {
    this._http.post<any>(environment.apiUrl + '/tasks', task.text).subscribe(res => { this.findAll(); });
  }

  changeState(task: Task, taskState: TaskState) {
    task.taskState = taskState;
    this._http.put(environment.apiUrl + '/tasks/' + task.id, task).subscribe(res => { this.findAll(); });
  }
  update(task: Task) {
    task.taskState = TaskState.DONE;
    this._http.put(environment.apiUrl + '/tasks/' + task.id, task).subscribe(res => { this.findAll(); });
  }

  updateTask(task: Task){
    this._http.put(environment.apiUrl + '/tasks/' + task.id, task).subscribe(res => { this.findAll(); });
  }

  clear() {
    this._http.delete(environment.apiUrl + '/tasks').subscribe(res => { this.findAll(); });
  }

  delete(task: Task) {
    this._http.delete(environment.apiUrl + '/tasks/' + task.id).subscribe(res => { this.findAll(); });
  }

  openDialog(action: string, task: Task = new Task()): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      data: task
    });

    dialogRef.afterClosed().subscribe(text => {
      if (task !== undefined && action ==='ADD')
        this.save(task);
      else if (task !== undefined && action ==='EDIT')
        this.updateTask(task);
      else 
        this.findAll();
    });
  }

  openConfirmDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      this.delete(task);
    });
  }


}

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTask(t) {
    this.dialogRef.close(t);
  }

}

@Component({
  selector: 'confirm-dialog-component',
  templateUrl: './confirmdialog.component.html',
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
    delete(t): void {
    this.dialogRef.close(t);
  }

}
import { TaskState } from './../models/task-state';
import { Task } from './../models/task';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  panelOpenState = false;
  taskList: Task[];

  constructor(protected _http: HttpClient) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this._http.get<Task[]>(environment.apiUrl + '/tasks').subscribe(res => {
      this.taskList = res;
    })
  }

  save() {
    this._http.post<any>(environment.apiUrl + '/tasks', 'teste').subscribe(res => { this.findAll(); });
  }

  deleteAll(){
    this._http.delete(environment.apiUrl + '/tasks').subscribe(res => { this.findAll(); });
  }

  update(task: Task){
    task.taskState=TaskState.DONE;
    this._http.put(environment.apiUrl + '/tasks/' + task.id, task).subscribe(res => { this.findAll(); });
  }
}

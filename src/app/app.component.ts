import { Component } from "@angular/core";
import { ApiService } from "./apiService/api.service";
import { forkJoin, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private destroy$ = new Subject();
  url = "https://jsonplaceholder.typicode.com/todos";
  delayUrl = "https://deelay.me/5000/";
  constructor(private api: ApiService) {}
  values = [
    {
      id: "1",
      url: `${this.delayUrl}${this.url}`
    },
    {
      id: "2",
      url: `${this.delayUrl}${this.url}`
    },
    {
      id: "3",
      url: `${this.delayUrl}${this.url}`
    }
  ];
  getData() {
    let apiList = this.values.map((value) =>
      this.api.set(`${value.url}/${value.id}`, "GET", {
        id: "getSensorData"
      })
    );
    this.values.forEach((value) => {
      this.api.set(`${value.url}/${value.id}`, "GET", {
        id: "getSensorData"
      });
    });

    forkJoin(apiList)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        console.log(results);
      });
  }
  cancelGet() {
    // abort flow
    this.destroy$.next();
  }
  editRes(res) {
    console.log("edit res", res);
  }
  ngOndestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Temperature } from './models/temp.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webApp';

  public tempData: [Temperature];


  constructor(private httpClient: HttpClient) { }
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        display: true,
        labelString: "Temp in Celsius"
      }],
      xAxes: [{
        display: true,
        labelString: "Time"
      }]
    }
  };
  public lineChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public lineChartType = 'line';
  public lineChartLegend = true;
  public lineChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  
  getTemp() {
    this.httpClient.get('http://localhost:49160/api/temp').subscribe((res: [Temperature]) => {
        this.tempData = res;
        this.tempToData(res);
    });
  }
  ngOnInit() {
  }
  tempToData(tempData: [Temperature]) {
    let newList = this.mergeAndProcess(tempData);
    console.log(newList);
    let splittedList = this.splitAndSort(newList);
    console.log(splittedList);
    this.setLabelsAndData(splittedList);


  }

  splitAndSort(dataToSort: [Temperature]): [[Temperature]] {
    let splitList: [[Temperature]];
    dataToSort.forEach(element => {
      if (typeof splitList != 'undefined') {
        for (let i = 0; i < splitList.length; i++) {
          if (splitList[i][0].sensor == element.sensor) {
            splitList[i].push(element);
            break;
          }
          splitList.push([element]);
        }
      }
      else {
        splitList = [[element]];
      }
    });
    return splitList;
  }

  mergeAndProcess(duplicateList: [Temperature]): [Temperature] {
    for (let j = 0; j < duplicateList.length; j++) {
      if ((typeof duplicateList[j].time) == 'string') {
        duplicateList[j].time = new Date(duplicateList[j].time);
        duplicateList[j].time.setSeconds(0);
      }
      for (let k = 0; k < duplicateList.length; k++) {
        if ((typeof duplicateList[k].time) == 'string') {
          duplicateList[k].time = new Date(duplicateList[k].time);
          duplicateList[k].time.setSeconds(0);
        }
        if (duplicateList[j]._id != duplicateList[k]._id) {
          if ((duplicateList[j].sensor == duplicateList[k].sensor) &&
          (duplicateList[j].time.getFullYear() == duplicateList[k].time.getFullYear()) && 
          (duplicateList[j].time.getMonth() == duplicateList[k].time.getMonth()) && 
          (duplicateList[j].time.getDate() == duplicateList[k].time.getDate()) && 
          (duplicateList[j].time.getHours() == duplicateList[k].time.getHours()) && 
          (duplicateList[j].time.getMinutes() == duplicateList[k].time.getMinutes()) 
          ){
            duplicateList[j].temp = ((duplicateList[j].temp + duplicateList[k].temp)/2);
            duplicateList.splice(k, 1);
          }
        }
      }
    }
    return duplicateList;
  }

  setLabelsAndData(labelListData: [[Temperature]]) {
    let labelList = [];
    let dataList = [];
    let toDate;
    let fromDate;

    labelListData.forEach(e => {
      e.forEach(f => {
        if (typeof fromDate == 'undefined') {
          fromDate = f.time;
        }
        if (typeof toDate == 'undefined') {
          toDate = f.time;
        }
        if (f.time < fromDate) {
          fromDate = f.time;
        }
        if (f.time > toDate) {
          toDate = f.time;
        }
      });
     });
     console.log(toDate);
     console.log(fromDate);
     let minutes = (toDate.getTime() - fromDate.getTime()) / 1000;
     minutes /= 60;
     minutes = Math.abs(Math.round(minutes));

     console.log(minutes);
     for (let i = 0; i< (minutes+1); i++) {
       labelList.push(fromDate.toLocaleString());
       fromDate = new Date(fromDate.getTime() + 60000);
     };

    labelListData.forEach((e, i) => {
      if (dataList.length == 0) {
        dataList.push({
          data: [],
          label: e[0].sensor
        })
      }
      else if (dataList[i].label != e[0].sensor) {
        dataList.push({
          data: [],
          label: e[0].sensor
        })
      }
      e.forEach(f => {
        let newLabel = f.time.toLocaleString();
        labelList.forEach((g, j) => {
          if (newLabel == g) {
            dataList[i].data[j] = f.temp;
          }
        });

      });
    } );
    this.lineChartLabels = labelList;
    this.lineChartData = dataList;
  }
}



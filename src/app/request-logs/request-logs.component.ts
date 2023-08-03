import { ImplicitReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {LogsService} from '../services/logs.service'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-request-logs',
  templateUrl: './request-logs.component.html',
  styleUrls: ['./request-logs.component.css']
})
export class RequestLogsComponent implements OnInit{
  logs: any[] = [];
  startTime: string = '';
  endTime: string = '';
  selectedTimeframe: string = 'last5mins'; 
  customStartTime: string = ''; 
  customEndTime: string = ''; 
  showIdColumn: boolean = true;
    showIpColumn: boolean = true; 
  showUsernameColumn: boolean = true; 
  showRequestBodyColumn: boolean = true; 
  showTimeStampColumn: boolean = true;

  constructor(
    private logsService:LogsService
  ){ this.logs = [];}
  ngOnInit(): void {
    // Set default time range to last 5 minutes
    const defaultEndTime = new Date().toISOString();
    const defaultStartTime = new Date();
    defaultStartTime.setMinutes(defaultStartTime.getMinutes() - 5);
    this.startTime = defaultStartTime.toISOString();
    this.endTime = defaultEndTime;

    // Fetch logs with default time range
    this.loadLogs();
  }

 loadLogs() {
  console.log('Loading logs...');
  this.logsService.getLogs(this.startTime, this.endTime).subscribe(
    (data: any) => {
      console.log('Logs data received:', data);
      this.logs = data;
     
    },
    (error) => {
      console.log('Error fetching logs:', error);
    }
  );
}



  onTimeRangeSelect(range: string) {
    const currentTime = new Date().toISOString();
    switch (range) {
      case 'last5mins':
        const last5Mins = new Date();
        last5Mins.setMinutes(last5Mins.getMinutes() - 5);
        this.startTime = last5Mins.toISOString();
        this.endTime = currentTime;
        break;
      case 'last10mins':
        const last10Mins = new Date();
        last10Mins.setMinutes(last10Mins.getMinutes() - 10);
        this.startTime = last10Mins.toISOString();
        this.endTime = currentTime;
        break;
      case 'last30mins':
        const last30Mins = new Date();
        last30Mins.setMinutes(last30Mins.getMinutes() - 30);
        this.startTime = last30Mins.toISOString();
        this.endTime = currentTime;
        break;
      default:
        break;
    }

    this.loadLogs();
  }
  }



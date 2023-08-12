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

  onCustomTimeChange() {
    // Convert customStartTime and customEndTime to ISO 8601 format
    if (this.customStartTime) {
      this.startTime = new Date(this.customStartTime).toISOString();
    }
    if (this.customEndTime) {
      this.endTime = new Date(this.customEndTime).toISOString();
    }
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

  onTimeRangeSelect() {
    if (this.selectedTimeframe === 'custom') {
      // Custom timeframe selected, use customStartTime and customEndTime
      this.startTime = this.customStartTime;
      this.endTime = this.customEndTime;
    } else {
      // Use preset timeframes
      const currentTime = new Date().toISOString();
      switch (this.selectedTimeframe) {
        case 'last5mins':
          const last5Mins = new Date();
        last5Mins.setMinutes(last5Mins.getMinutes() - 5);
        this.startTime = last5Mins.toISOString();
        this.endTime = currentTime;
        break;
        case 'last10mins':
          this.startTime = calculateStartTime(10);
          this.endTime = currentTime;
          break;
        case 'last30mins':
          this.startTime = calculateStartTime(30);
          this.endTime = currentTime;
          break;
        default:
          break;
      }
    }

    this.loadLogs();
  }
}
function calculateStartTime(minutes: number): string {
  const startTime = new Date();
  startTime.setMinutes(startTime.getMinutes() - minutes);
  return startTime.toISOString();
}





//  loadLogs() {
//   console.log('Loading logs...');
//   this.logsService.getLogs(this.startTime, this.endTime).subscribe(
//     (data: any) => {
//       console.log('Logs data received:', data);
//       this.logs = data;
     
//     },
//     (error) => {
//       console.log('Error fetching logs:', error);
//     }
//   );
// }



//   onTimeRangeSelect(range: string) {
//     const currentTime = new Date().toISOString();
//     switch (range) {
//       case 'last5mins':
//         const last5Mins = new Date();
//         last5Mins.setMinutes(last5Mins.getMinutes() - 5);
//         this.startTime = last5Mins.toISOString();
//         this.endTime = currentTime;
//         break;
//       case 'last10mins':
//         const last10Mins = new Date();
//         last10Mins.setMinutes(last10Mins.getMinutes() - 10);
//         this.startTime = last10Mins.toISOString();
//         this.endTime = currentTime;
//         break;
//       case 'last30mins':
//         const last30Mins = new Date();
//         last30Mins.setMinutes(last30Mins.getMinutes() - 30);
//         this.startTime = last30Mins.toISOString();
//         this.endTime = currentTime;
//         break;
//       default:
//         break;
//     }

//     this.loadLogs();
//   }
 // }



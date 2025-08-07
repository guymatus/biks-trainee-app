import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { DataService, Student } from '../../core/services/data.service';
import { StateService, MonitorPageState } from '../../core/services/state.service';
import { Subject, takeUntil } from 'rxjs';

export interface StudentMonitor {
  id: string;
  name: string;
  average: number;
  exams: number;
  status: 'Passed' | 'Failed';
}

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  studentMonitors: StudentMonitor[] = [];
  filteredStudents: StudentMonitor[] = [];
  
  // Filter properties
  selectedIds: string[] = [];
  nameFilter: string = '';
  showPassed: boolean = true;
  showFailed: boolean = true;
  
  availableIds: string[] = [];
  
  // Table properties
  displayedColumns: string[] = ['id', 'name', 'average', 'exams', 'status'];

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.loadSavedState();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSavedState(): void {
    const savedState = this.stateService.getMonitorState();
    
    this.selectedIds = savedState.selectedIds || [];
    this.nameFilter = savedState.nameFilter || '';
    this.showPassed = savedState.showPassed !== undefined ? savedState.showPassed : true;
    this.showFailed = savedState.showFailed !== undefined ? savedState.showFailed : true;
  }

  saveState(): void {
    const state: MonitorPageState = {
      selectedIds: this.selectedIds,
      nameFilter: this.nameFilter,
      showPassed: this.showPassed,
      showFailed: this.showFailed
    };

    this.stateService.setMonitorState(state);
  }

  loadData(): void {
    this.dataService.getAllStudents().subscribe(students => {
      this.students = students;
      this.availableIds = [...new Set(students.map(s => s.id))];
      this.processStudentData();
      this.applyFilters();
    });
  }

  processStudentData(): void {
    // Group students by ID and calculate averages
    const studentGroups = new Map<string, Student[]>();
    
    this.students.forEach(student => {
      if (!studentGroups.has(student.id)) {
        studentGroups.set(student.id, []);
      }
      studentGroups.get(student.id)!.push(student);
    });

    this.studentMonitors = Array.from(studentGroups.entries()).map(([id, studentList]) => {
      const average = studentList.reduce((sum, student) => sum + student.grade, 0) / studentList.length;
      const status: 'Passed' | 'Failed' = average >= 65 ? 'Passed' : 'Failed';
      
      return {
        id,
        name: studentList[0].name, // Use the first student's name for the group
        average: Math.round(average * 10) / 10, // Round to 1 decimal place
        exams: studentList.length,
        status
      };
    });

    this.filteredStudents = [...this.studentMonitors];
  }

  applyFilters(): void {
    let filtered = [...this.studentMonitors];

    // Filter by selected IDs (empty means "Show All")
    if (this.selectedIds.length > 0) {
      filtered = filtered.filter(student => this.selectedIds.includes(student.id));
    }

    // Filter by name (empty means "Show All")
    if (this.nameFilter.trim()) {
      const nameLower = this.nameFilter.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(nameLower)
      );
    }

    // Filter by status
    filtered = filtered.filter(student => {
      if (student.status === 'Passed' && !this.showPassed) return false;
      if (student.status === 'Failed' && !this.showFailed) return false;
      return true;
    });

    this.filteredStudents = filtered;
  }

  onIdSelectionChange(): void {
    this.applyFilters();
    this.saveState();
  }

  onNameFilterChange(): void {
    this.applyFilters();
    this.saveState();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
    this.saveState();
  }

  getStatusClass(status: 'Passed' | 'Failed'): string {
    return status === 'Passed' ? 'status-passed' : 'status-failed';
  }

  getPassedCount(): number {
    return this.studentMonitors.filter(s => s.status === 'Passed').length;
  }

  getFailedCount(): number {
    return this.studentMonitors.filter(s => s.status === 'Failed').length;
  }

  getTotalCount(): number {
    return this.studentMonitors.length;
  }
} 
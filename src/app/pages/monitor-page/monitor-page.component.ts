import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService, Student } from '../../core/services/data.service';
import { StateService, MonitorPageState } from '../../core/services/state.service';
import { Subject, takeUntil } from 'rxjs';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

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
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
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
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = APP_CONSTANTS.DEFAULT_PAGE_SIZE;
  
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
    this.currentPage = savedState.currentPage || 1;
    this.pageSize = savedState.pageSize || APP_CONSTANTS.DEFAULT_PAGE_SIZE;
  }

  saveState(): void {
    const state: MonitorPageState = {
      selectedIds: this.selectedIds,
      nameFilter: this.nameFilter,
      showPassed: this.showPassed,
      showFailed: this.showFailed,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    };

    this.stateService.setMonitorState(state);
  }

  loadData(): void {
    this.dataService.getAllStudents().subscribe(students => {
      this.students = students;
      this.availableIds = [...new Set(students.map(s => s.id))];
      this.processStudentData();
      this.applyPagination(); // Use applyPagination instead of applyFilters to preserve page
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

  applyFilters(resetPage: boolean = true): void {
    let filtered = [...this.studentMonitors];

    // Filter by selected IDs (empty means "Show All")
    if (this.selectedIds.length > 0) {
      filtered = filtered.filter(student => this.selectedIds.includes(student.id));
    }

    // Filter by names (empty means "Show All")
    if (this.nameFilter.trim()) {
      const names = this.nameFilter.split(',').map(name => name.trim().toLowerCase()).filter(name => name.length > 0);
      filtered = filtered.filter(student => 
        names.some(name => student.name.toLowerCase().includes(name))
      );
    }

    // Filter by status
    filtered = filtered.filter(student => {
      if (student.status === 'Passed' && !this.showPassed) return false;
      if (student.status === 'Failed' && !this.showFailed) return false;
      return true;
    });

    // Reset to first page when filters change (but not when loading saved state)
    if (resetPage) {
      this.currentPage = 1;
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredStudents = filtered.slice(startIndex, endIndex);
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
    this.saveState();
  }

  applyPagination(): void {
    // Use applyFilters with resetPage=false to preserve current page
    this.applyFilters(false);
  }

  clearIds(): void {
    this.selectedIds = [];
    this.applyFilters();
    this.saveState();
  }

  clearNameFilter(): void {
    this.nameFilter = '';
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

  get totalFilteredCount(): number {
    let filtered = [...this.studentMonitors];

    if (this.selectedIds.length > 0) {
      filtered = filtered.filter(student => this.selectedIds.includes(student.id));
    }

    if (this.nameFilter.trim()) {
      const names = this.nameFilter.split(',').map(name => name.trim().toLowerCase()).filter(name => name.length > 0);
      filtered = filtered.filter(student => 
        names.some(name => student.name.toLowerCase().includes(name))
      );
    }

    filtered = filtered.filter(student => {
      if (student.status === 'Passed' && !this.showPassed) return false;
      if (student.status === 'Failed' && !this.showFailed) return false;
      return true;
    });

    return filtered.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalFilteredCount / this.pageSize);
  }

  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalFilteredCount);
    return `Showing ${start}-${end} of ${this.totalFilteredCount} students`;
  }
} 
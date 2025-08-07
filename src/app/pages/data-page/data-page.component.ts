import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataService, Student, DataResponse } from '../../core/services/data.service';
import { StateService } from '../../core/services/state.service';
import { AddStudentDialogComponent } from '../../shared/components/add-student-dialog/add-student-dialog.component';
import { Subject, takeUntil } from 'rxjs';

export interface DataPageState {
  currentPage: number;
  filterText: string;
  selectedStudentId?: string;
  pageSize: number;
}

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit, OnDestroy {
  students = signal<Student[]>([]);
  totalStudents = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);
  filterText = signal('');
  filterValue = '';
  loading = signal(false);
  selectedStudent = signal<Student | null>(null);

  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject'];

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private stateService: StateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSavedState();
    this.loadStudents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSavedState() {
    const savedState = this.stateService.getPageState<DataPageState>('data', {
      currentPage: 1,
      filterText: '',
      pageSize: 10
    });
    
    this.currentPage.set(savedState.currentPage);
    this.filterText.set(savedState.filterText);
    this.filterValue = savedState.filterText;
    
    if (savedState.selectedStudentId) {
      this.loadSelectedStudent(savedState.selectedStudentId);
    }
  }

  private saveState() {
    const state: DataPageState = {
      currentPage: this.currentPage(),
      filterText: this.filterText(),
      pageSize: this.pageSize(),
      selectedStudentId: this.selectedStudent()?.id
    };

    this.stateService.setPageState('data', state);
  }

  private loadSelectedStudent(studentId: string) {
    this.dataService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.selectedStudent.set(student);
      },
      error: (error) => {
        console.error('Error loading selected student:', error);
      }
    });
  }

  loadStudents() {
    this.loading.set(true);
    this.dataService.getStudents(this.currentPage(), this.pageSize(), this.filterText())
      .subscribe({
        next: (response: DataResponse) => {
          this.students.set(response.students);
          this.totalStudents.set(response.total);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.loading.set(false);
        }
      });
  }

  onFilterChange() {
    this.filterText.set(this.filterValue);
    this.currentPage.set(1);
    this.saveState();
    this.loadStudents();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.saveState();
    this.loadStudents();
  }

  onAddStudent() {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '1000px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add the new student to the system
        this.dataService.addStudent(result).subscribe({
          next: (newStudent) => {
            // Reload the students to show the new one
            this.loadStudents();
            
            // Select the new student
            this.selectedStudent.set(newStudent);
            this.saveState();
          },
          error: (error) => {
            console.error('Error adding student:', error);
          }
        });
      }
    });
  }

  onRemoveStudent(studentId: string, studentName: string) {
    if (confirm('Are you sure you want to remove ' + studentName + '?')) {
      this.dataService.deleteStudent(studentId).subscribe({
        next: () => {
          // Clear selection if the removed student was selected
          if (this.selectedStudent()?.id === studentId) {
            this.selectedStudent.set(null);
            this.saveState();
          }
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
        }
      });
    }
  }

  onSelectStudent(student: Student) {
    this.selectedStudent.set(student);
    this.saveState();
  }

  onUnselectStudent() {
    this.selectedStudent.set(null);
    this.saveState();
  }

  clearFilter() {
    this.filterValue = '';
    this.filterText.set('');
    this.currentPage.set(1);
    this.saveState();
    this.loadStudents();
  }

  get totalPages(): number {
    return Math.ceil(this.totalStudents() / this.pageSize());
  }

  get paginationInfo(): string {
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), this.totalStudents());
    return `Showing ${start} to ${end} of ${this.totalStudents()} results`;
  }
} 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Student } from '../../core/services/data.service';
import { StateService, AnalysisPageState } from '../../core/services/state.service';
import { Subject, takeUntil } from 'rxjs';

export interface ChartConfig {
  id: string;
  title: string;
  type: 'chart1' | 'chart2' | 'chart3';
  visible: boolean;
  position: 'left' | 'right' | 'bottom';
}

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss']
})
export class AnalysisPageComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  selectedStudentIds: string[] = [];
  selectedSubjects: string[] = [];
  availableStudentIds: string[] = [];
  availableSubjects: string[] = [];
  
  charts: ChartConfig[] = [
    { id: 'chart1', title: 'Chart 1: Grades average over time for students with ID (for each student)', type: 'chart1', visible: true, position: 'left' },
    { id: 'chart2', title: 'Chart 2: Students averages for students with chosen ID', type: 'chart2', visible: false, position: 'bottom' },
    { id: 'chart3', title: 'Chart 3: Grades averages per subject', type: 'chart3', visible: true, position: 'right' }
  ];

  draggedChart: ChartConfig | null = null;
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
    const savedState = this.stateService.getAnalysisState();
    
    // Load filter selections
    this.selectedStudentIds = savedState.selectedStudentIds || [];
    this.selectedSubjects = savedState.selectedSubjects || [];
    
    // Load chart positions
    if (savedState.chartPositions) {
      this.updateChartPositions(savedState.chartPositions);
    }
  }

  saveState(): void {
    const chartPositions: { [key: string]: string } = {};
    this.charts.forEach(chart => {
      chartPositions[chart.id] = chart.position;
    });

    const state: AnalysisPageState = {
      selectedStudentIds: this.selectedStudentIds,
      selectedSubjects: this.selectedSubjects,
      chartPositions
    };

    this.stateService.setAnalysisState(state);
  }

  updateChartPositions(positions: { [key: string]: string }): void {
    this.charts.forEach(chart => {
      const newPosition = positions[chart.id];
      if (newPosition && ['left', 'right', 'bottom'].includes(newPosition)) {
        // Find the chart currently in the target position
        const targetChart = this.charts.find(c => c.position === newPosition);
        if (targetChart && targetChart.id !== chart.id) {
          // Swap positions
          const tempPosition = chart.position;
          chart.position = targetChart.position;
          targetChart.position = tempPosition;
        } else if (!targetChart) {
          // Direct assignment
          chart.position = newPosition as 'left' | 'right' | 'bottom';
        }
      }
    });

    // Update visibility based on positions
    this.charts.forEach(chart => {
      chart.visible = chart.position !== 'bottom';
    });
  }

  loadData(): void {
    this.dataService.getAllStudents().subscribe(students => {
      this.students = students;
      this.availableStudentIds = [...new Set(students.map(s => s.id))];
      this.availableSubjects = [...new Set(students.map(s => s.subject))];
    });
  }

  onStudentIdsChange(): void {
    this.saveState();
  }

  onSubjectsChange(): void {
    this.saveState();
  }

  onDragStart(event: DragEvent, chart: ChartConfig): void {
    this.draggedChart = chart;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', chart.id);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent, targetPosition: 'left' | 'right'): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.draggedChart) return;

    // Find the chart currently in the target position
    const targetChart = this.charts.find(c => c.position === targetPosition);
    const draggedChart = this.charts.find(c => c.id === this.draggedChart!.id);

    if (targetChart && draggedChart) {
      // Swap positions
      const draggedPosition = draggedChart.position;
      draggedChart.position = targetPosition;
      targetChart.position = draggedPosition;

      // Update visibility
      draggedChart.visible = true;
      targetChart.visible = targetChart.position !== 'bottom';
    }

    this.draggedChart = null;
    this.saveState();
  }

  getChartByPosition(position: 'left' | 'right' | 'bottom'): ChartConfig | undefined {
    return this.charts.find(c => c.position === position);
  }

  getFilteredStudents(): Student[] {
    // Empty filters mean "Show All"
    if (this.selectedStudentIds.length === 0) {
      return this.students;
    }
    return this.students.filter(s => this.selectedStudentIds.includes(s.id));
  }

  getFilteredStudentsBySubject(): Student[] {
    // Empty filters mean "Show All"
    if (this.selectedSubjects.length === 0) {
      return this.students;
    }
    return this.students.filter(s => this.selectedSubjects.includes(s.subject));
  }

  getAverageGradeByStudent(studentId: string): number {
    const studentGrades = this.students.filter(s => s.id === studentId).map(s => s.grade);
    if (studentGrades.length === 0) return 0;
    return studentGrades.reduce((sum, grade) => sum + grade, 0) / studentGrades.length;
  }

  getAverageGradeBySubject(subject: string): number {
    const subjectGrades = this.students.filter(s => s.subject === subject).map(s => s.grade);
    if (subjectGrades.length === 0) return 0;
    return subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length;
  }
} 
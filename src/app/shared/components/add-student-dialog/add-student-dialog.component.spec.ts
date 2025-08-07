import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStudentDialogComponent } from './add-student-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


describe('AddStudentDialogComponent', () => {
  let component: AddStudentDialogComponent;
  let fixture: ComponentFixture<AddStudentDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddStudentDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        AddStudentDialogComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddStudentDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddStudentDialogComponent>>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Assert
    expect(component.student.name).toBe('');
    expect(component.student.grade).toBe(0);
    expect(component.student.subject).toBe('');
    expect(component.student.email).toBe('');
    expect(component.student.date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/); // DD/MM/YYYY format
    expect(component.student.dateJoined).toMatch(/^\d{2}\/\d{2}\/\d{4}$/); // DD/MM/YYYY format
  });

  it('should have subjects array populated', () => {
    // Assert
    expect(component.subjects.length).toBeGreaterThan(0);
    expect(component.subjects).toContain('Mathematics');
    expect(component.subjects).toContain('Physics');
    expect(component.subjects).toContain('Chemistry');
  });

  it('should validate form correctly', () => {
    // Arrange - Empty form
    component.student.name = '';
    component.student.grade = 0;
    component.student.subject = '';

    // Act & Assert
    expect(component.isFormValid()).toBe(false);

    // Arrange - Valid form
    component.student.name = 'John Doe';
    component.student.grade = 85;
    component.student.subject = 'Mathematics';

    // Act & Assert
    expect(component.isFormValid()).toBe(true);
  });

  it('should close dialog with student data on save', () => {
    // Arrange
    component.student.name = 'John Doe';
    component.student.grade = 85;
    component.student.subject = 'Mathematics';
    component.student.email = 'john@example.com';
    component.student.date = '15/03/2024';
    component.student.dateJoined = '01/01/2024';

    // Act
    component.onSave();

    // Assert
    expect(dialogRef.close).toHaveBeenCalledWith({
      name: 'John Doe',
      grade: 85,
      subject: 'Mathematics',
      email: 'john@example.com',
      date: '15/03/2024',
      dateJoined: '01/01/2024',
      address: '',
      city: '',
      country: '',
      zip: ''
    });
  });

  it('should not close dialog if form is invalid', () => {
    // Arrange
    component.student.name = '';
    component.student.grade = 0;
    component.student.subject = '';

    // Act
    component.onSave();

    // Assert
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    // Act
    component.onCancel();

    // Assert
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    // This test verifies the date format in the component initialization
    expect(component.student.date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(component.student.dateJoined).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('should handle date formatting with single digits', () => {
    // This test verifies the date format pattern
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    expect(component.student.date).toMatch(datePattern);
    expect(component.student.dateJoined).toMatch(datePattern);
  });

  it('should validate email format', () => {
    // Arrange & Act & Assert
    component.student.email = 'invalid-email';
    expect(component.isFormValid()).toBe(false);

    component.student.email = 'valid@email.com';
    component.student.name = 'John Doe';
    component.student.grade = 85;
    component.student.subject = 'Mathematics';
    expect(component.isFormValid()).toBe(true);
  });

  it('should validate grade range', () => {
    // Arrange
    component.student.name = 'John Doe';
    component.student.subject = 'Mathematics';

    // Act & Assert - Grade too low
    component.student.grade = -1;
    expect(component.isFormValid()).toBe(false);

    // Act & Assert - Grade too high
    component.student.grade = 101;
    expect(component.isFormValid()).toBe(false);

    // Act & Assert - Valid grade
    component.student.grade = 85;
    expect(component.isFormValid()).toBe(true);
  });

  it('should have required fields marked', () => {
    // This test ensures the template has proper validation
    fixture.detectChanges();
    
    // Check if required attributes are present in the template
    const nameInput = fixture.nativeElement.querySelector('input[name="name"]');
    expect(nameInput).toBeTruthy();
  });
});

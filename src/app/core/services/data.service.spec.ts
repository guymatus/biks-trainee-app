import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService, Student, DataResponse } from './data.service';
import { of } from 'rxjs';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return students with pagination', (done) => {
    // Arrange
    const page = 1;
    const pageSize = 10;
    const filter = '';

    // Act
    service.getStudents(page, pageSize, filter).subscribe({
      next: (response: DataResponse) => {
        // Assert
        expect(response.students).toBeDefined();
        expect(response.total).toBeDefined();
        expect(response.students.length).toBeLessThanOrEqual(pageSize);
        expect(response.total).toBeGreaterThan(0);
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should filter students by name', (done) => {
    // Arrange
    const page = 1;
    const pageSize = 10;
    const filter = 'John'; // Assuming there's a student named John

    // Act
    service.getStudents(page, pageSize, filter).subscribe({
      next: (response: DataResponse) => {
        // Assert
        expect(response.students).toBeDefined();
        if (response.students.length > 0) {
          const hasMatchingStudent = response.students.some(student => 
            student.name.toLowerCase().includes(filter.toLowerCase())
          );
          expect(hasMatchingStudent).toBe(true);
        }
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should return student by ID', (done) => {
    // Arrange
    const studentId = '100000001';

    // Act
    service.getStudentById(studentId).subscribe({
      next: (student: Student) => {
        // Assert
        expect(student).toBeDefined();
        expect(student.id).toBe(studentId);
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should add a new student', (done) => {
    // Arrange
    const newStudent = {
      name: 'Test Student',
      date: '15/03/2024',
      grade: 85,
      subject: 'Mathematics',
      email: 'test@example.com',
      dateJoined: '01/01/2024',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      zip: '12345'
    };

    // Act
    service.addStudent(newStudent).subscribe({
      next: (addedStudent: Student) => {
        // Assert
        expect(addedStudent).toBeDefined();
        expect(addedStudent.name).toBe(newStudent.name);
        expect(addedStudent.id).toMatch(/^100000\d{3}$/); // 9-digit ID format
        expect(addedStudent.date).toBe(newStudent.date);
        expect(addedStudent.grade).toBe(newStudent.grade);
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should delete a student', (done) => {
    // Arrange
    const studentId = '100000001';

    // Act
    service.deleteStudent(studentId).subscribe({
      next: () => {
        // Assert - verify the student is no longer in the list
        service.getStudents(1, 100, '').subscribe({
          next: (response: DataResponse) => {
            const deletedStudent = response.students.find(s => s.id === studentId);
            expect(deletedStudent).toBeUndefined();
            done();
          },
          error: (error) => {
            fail('Should not have an error: ' + error);
            done();
          }
        });
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should return students sorted alphabetically by first name then last name', (done) => {
    // Arrange
    const page = 1;
    const pageSize = 28; // Get all students to test sorting

    // Act
    service.getStudents(page, pageSize, '').subscribe({
      next: (response: DataResponse) => {
        // Assert
        expect(response.students.length).toBeGreaterThan(1);
        
        // Check if students are sorted alphabetically
        for (let i = 1; i < response.students.length; i++) {
          const prevName = response.students[i - 1].name.toLowerCase();
          const currentName = response.students[i].name.toLowerCase();
          expect(prevName <= currentName).toBe(true);
        }
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should format dates in DD/MM/YYYY format', (done) => {
    // Arrange
    const page = 1;
    const pageSize = 5;

    // Act
    service.getStudents(page, pageSize, '').subscribe({
      next: (response: DataResponse) => {
        // Assert
        response.students.forEach(student => {
          // Check date format (DD/MM/YYYY)
          const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
          expect(student.date).toMatch(dateRegex);
          expect(student.dateJoined).toMatch(dateRegex);
        });
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });

  it('should use 9-digit ID format', (done) => {
    // Arrange
    const page = 1;
    const pageSize = 5;

    // Act
    service.getStudents(page, pageSize, '').subscribe({
      next: (response: DataResponse) => {
        // Assert
        response.students.forEach(student => {
          // Check ID format (100000XXX)
          const idRegex = /^100000\d{3}$/;
          expect(student.id).toMatch(idRegex);
        });
        done();
      },
      error: (error) => {
        fail('Should not have an error: ' + error);
        done();
      }
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterTestingModule } from '@angular/router/testing';
import { AddprofessorComponent } from './addprofessor.component';
import { AdminService } from 'src/app/services/admin.service';
import { ProfessorService } from 'src/app/services/professor.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Professor } from 'src/app/models/professor';
import { User } from 'src/app/models/user';

describe('AddprofessorComponent', () => {
  let component: AddprofessorComponent;
  let fixture: ComponentFixture<AddprofessorComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let professorServiceSpy: jasmine.SpyObj<ProfessorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['addProfessor']);
    professorServiceSpy = jasmine.createSpyObj('ProfessorService', ['']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AddprofessorComponent],
      imports: [FormsModule, RouterTestingModule], // Add FormsModule
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: ProfessorService, useValue: professorServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprofessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add professor successfully', () => {
    const professor: Professor = new Professor();
    adminServiceSpy.addProfessor.and.returnValue(of(professor));

    component.professor = professor;
    component.addProfessor();

    expect(adminServiceSpy.addProfessor).toHaveBeenCalledWith(professor);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admindashboard']);
  });

  it('should handle error when adding professor', () => {
    const errorResponse = { error: 'Professor with email already exists' };
    adminServiceSpy.addProfessor.and.returnValue(throwError(errorResponse));

    const professor: Professor = new Professor();
    professor.email = 'test@example.com';
    component.professor = professor;
    component.addProfessor();

    expect(adminServiceSpy.addProfessor).toHaveBeenCalledWith(professor);
    expect(component.msg).toEqual(`Professor with ${professor.email} already exists !!!`);
  });

  // You can add more test cases as needed
});

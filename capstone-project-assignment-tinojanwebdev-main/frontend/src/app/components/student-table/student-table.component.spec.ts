import { of, Subject } from 'rxjs';
import { StudentTableComponent } from './student-table.component';

describe('StudentTableComponent name search', () => {
  let component: StudentTableComponent;
  const students = [
    { id: 1, name: 'Supun Mihiranga' },
    { id: 2, name: 'Sandun Perera' },
    { id: 3, name: 'Isuri De Silva' }
  ];

  beforeEach(() => {
    const service = { getStudentData: () => of(students) };
    component = new StudentTableComponent(service as any, {} as any);
    component.ngOnInit();
  });

  it('matches part of a name regardless of case and surrounding spaces', () => {
    component.search('  SILVA  ');
    expect(component.studentData).toEqual([[students[2]]]);
  });

  it('restores matches when backspacing and changing the query', () => {
    component.search('supun');
    component.search('s');
    expect(component.studentData.length).toBe(3);
    component.search('sandun');
    expect(component.studentData).toEqual([[students[1]]]);
  });

  it('shows no matches and restores all rows when cleared', () => {
    component.search('missing');
    expect(component.studentData).toEqual([]);
    component.search('');
    expect(component.studentData).toEqual(students.map(student => [student]));
  });

  it('applies a query entered before the data arrives', () => {
    const response = new Subject<any>();
    component = new StudentTableComponent({ getStudentData: () => response } as any, {} as any);
    component.ngOnInit();
    component.search('SILVA');
    response.next(students);
    expect(component.studentData).toEqual([[students[2]]]);
  });
});

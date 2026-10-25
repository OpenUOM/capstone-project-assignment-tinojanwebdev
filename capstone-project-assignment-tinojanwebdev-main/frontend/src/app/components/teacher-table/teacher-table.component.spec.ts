import { of, Subject } from 'rxjs';
import { TeacherTableComponent } from './teacher-table.component';

describe('TeacherTableComponent name search', () => {
  let component: TeacherTableComponent;
  const teachers = [
    { id: 1, name: 'Kusuma Ranasinghe' },
    { id: 2, name: 'Saman De Silva' },
    { id: 3, name: 'Parasanna Mahagamage' }
  ];

  beforeEach(() => {
    const service = { getTeacherData: () => of(teachers) };
    component = new TeacherTableComponent(service as any, {} as any);
    component.ngOnInit();
  });

  it('matches part of a name regardless of case and surrounding spaces', () => {
    component.search('  SILVA  ');
    expect(component.teacherData).toEqual([[teachers[1]]]);
  });

  it('restores matches when backspacing and changing the query', () => {
    component.search('saman');
    component.search('a');
    expect(component.teacherData.length).toBe(3);
    component.search('kusuma');
    expect(component.teacherData).toEqual([[teachers[0]]]);
  });

  it('shows no matches and restores all rows when cleared', () => {
    component.search('missing');
    expect(component.teacherData).toEqual([]);
    component.search('');
    expect(component.teacherData).toEqual(teachers.map(teacher => [teacher]));
  });

  it('applies a query entered before the data arrives', () => {
    const response = new Subject<any>();
    component = new TeacherTableComponent({ getTeacherData: () => response } as any, {} as any);
    component.ngOnInit();
    component.search('SILVA');
    response.next(teachers);
    expect(component.teacherData).toEqual([[teachers[1]]]);
  });
});

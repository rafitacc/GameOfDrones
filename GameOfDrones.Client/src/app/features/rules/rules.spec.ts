import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Move } from '../../core/models/move';
import { Rules } from './rules';

const defaults: Move[] = [
  { name: 'Paper', kills: ['Rock'] },
  { name: 'Rock', kills: ['Scissors'] },
  { name: 'Scissors', kills: ['Paper'] },
];

describe('Rules', () => {
  let fixture: ComponentFixture<Rules>;
  let http: HttpTestingController;

  const element = () => fixture.nativeElement as HTMLElement;
  const button = (text: string) =>
    [...element().querySelectorAll('button')].find((b) => b.textContent?.trim() === text)!;
  const nameInputs = () => [...element().querySelectorAll<HTMLInputElement>('.text-input')];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(Rules);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('/api/moves').flush(defaults);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('only enables saving once something changed', async () => {
    expect(button('Save rules').disabled).toBe(true);

    const paper = nameInputs()[0];
    paper.value = 'Sheet';
    paper.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(button('Save rules').disabled).toBe(false);
  });

  it('keeps the rules that point to a renamed move', async () => {
    const paper = nameInputs()[0];
    paper.value = 'Sheet';
    paper.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    button('Save rules').click();

    expect(http.expectOne({ method: 'PUT', url: '/api/moves' }).request.body).toEqual([
      { name: 'Sheet', kills: ['Rock'] },
      { name: 'Rock', kills: ['Scissors'] },
      { name: 'Scissors', kills: ['Sheet'] },
    ]);
  });

  it('removes a deleted move from what the others kill', async () => {
    button('Add move').click();
    await fixture.whenStable();
    const added = nameInputs()[3];
    added.value = 'Dog';
    added.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    element().querySelectorAll<HTMLButtonElement>('.move-card__remove')[0].click();
    await fixture.whenStable();
    button('Save rules').click();

    expect(http.expectOne({ method: 'PUT', url: '/api/moves' }).request.body).toEqual([
      { name: 'Rock', kills: ['Scissors'] },
      { name: 'Scissors', kills: [] },
      { name: 'Dog', kills: [] },
    ]);
  });
});

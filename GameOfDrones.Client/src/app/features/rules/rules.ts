import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';
import { errorMessages } from '../../core/api/error-messages';
import { MoveApi } from '../../core/api/move-api';
import { TranslationKey } from '../../core/i18n/en';
import { I18n } from '../../core/i18n/i18n';
import { Move, minimumMoves, moveNameMaxLength } from '../../core/models/move';
import { ErrorAlert } from '../../shared/error-alert/error-alert';
import { LoadState } from '../../shared/load-state/load-state';
import { PageIntro } from '../../shared/page-intro/page-intro';

/** Kills point to ids instead of names, so renaming a move keeps every rule that uses it. */
interface DraftMove {
  id: number;
  name: string;
  kills: number[];
}

@Component({
  selector: 'app-rules',
  imports: [ErrorAlert, LoadState, PageIntro],
  templateUrl: './rules.html',
  styleUrl: './rules.scss',
})
export class Rules implements OnInit {
  private readonly moveApi = inject(MoveApi);
  private readonly injector = inject(Injector);
  private readonly nameInputs = viewChildren<ElementRef<HTMLInputElement>>('nameInput');
  private nextId = 0;
  protected readonly i18n = inject(I18n);

  protected readonly minimumMoves = minimumMoves;
  protected readonly moveNameMaxLength = moveNameMaxLength;
  protected readonly drafts = signal<DraftMove[]>([]);
  protected readonly saved = signal<Move[] | null>(null);
  protected readonly busy = signal(false);
  protected readonly confirmingReset = signal(false);
  protected readonly notice = signal<TranslationKey | null>(null);
  protected readonly errors = signal<string[]>([]);

  protected readonly canRemove = computed(() => this.drafts().length > minimumMoves);
  protected readonly moves = computed<Move[]>(() => {
    const drafts = this.drafts();
    return drafts.map((draft) => ({
      name: draft.name,
      kills: drafts.filter((other) => draft.kills.includes(other.id)).map((other) => other.name),
    }));
  });
  protected readonly dirty = computed(() => {
    const saved = this.saved();
    return saved !== null && signature(this.moves()) !== signature(saved);
  });
  protected readonly summary = computed(() => {
    const list = new Intl.ListFormat(this.i18n.language(), { type: 'conjunction' });
    return this.moves().map((move) => {
      const name = move.name.trim() || this.i18n.t('rules.unnamed');
      return move.kills.length
        ? this.i18n.t('rules.summaryKills', { move: name, targets: list.format(move.kills) })
        : this.i18n.t('rules.summaryNothing', { move: name });
    });
  });

  ngOnInit(): void {
    this.run(this.moveApi.getAll(), null);
  }

  protected rename(id: number, name: string): void {
    this.update(id, (move) => ({ ...move, name }));
  }

  protected toggleKill(id: number, targetId: number): void {
    this.update(id, (move) => ({
      ...move,
      kills: move.kills.includes(targetId)
        ? move.kills.filter((kill) => kill !== targetId)
        : [...move.kills, targetId],
    }));
  }

  protected addMove(): void {
    this.drafts.update((drafts) => [...drafts, { id: this.nextId++, name: '', kills: [] }]);
    afterNextRender(() => this.nameInputs().at(-1)?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected removeMove(id: number): void {
    this.drafts.update((drafts) =>
      drafts
        .filter((move) => move.id !== id)
        .map((move) => ({ ...move, kills: move.kills.filter((kill) => kill !== id) })),
    );
  }

  protected save(): void {
    this.run(this.moveApi.replaceAll(this.moves()), 'rules.saved');
  }

  protected reset(): void {
    this.confirmingReset.set(false);
    this.run(this.moveApi.reset(), 'rules.restored');
  }

  private update(id: number, change: (move: DraftMove) => DraftMove): void {
    this.notice.set(null);
    this.drafts.update((drafts) => drafts.map((move) => (move.id === id ? change(move) : move)));
  }

  private run(request: Observable<Move[]>, notice: TranslationKey | null): void {
    this.busy.set(true);
    this.errors.set([]);
    this.notice.set(null);

    request.subscribe({
      next: (moves) => {
        this.load(moves);
        this.notice.set(notice);
        this.busy.set(false);
      },
      error: (error: unknown) => {
        this.errors.set(errorMessages(error, this.i18n));
        this.busy.set(false);
      },
    });
  }

  private load(moves: Move[]): void {
    const ids = new Map(moves.map((move) => [move.name, this.nextId++]));
    this.drafts.set(
      moves.map((move) => ({
        id: ids.get(move.name)!,
        name: move.name,
        kills: move.kills.map((kill) => ids.get(kill)!),
      })),
    );
    this.saved.set(moves);
  }
}

function signature(moves: Move[]): string {
  return JSON.stringify(moves.map((move) => [move.name, [...move.kills].sort()]));
}

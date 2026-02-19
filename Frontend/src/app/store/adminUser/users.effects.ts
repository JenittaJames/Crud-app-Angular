// user.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { loadUsers, loadUsersSuccess, loadUsersFailure } from './users.actions';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap, mergeMap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  // constructor(private actions$: Actions, private authService: AuthService) {
  //   console.log("🔥 UserEffects initialized");
  //   console.log("🧩 this.actions$:", this.actions$);
  // }

  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      mergeMap(() =>
        this.authService.getAllUsers().pipe(
          tap((data) => console.log('✅ Fetched users', data)),
          map((res: any) => loadUsersSuccess({ users: res.users })),
          catchError((error) => {
            console.error('❌ API Error', error)
            return of(loadUsersFailure({ error }))
          })
        )
      )
    )
  )
}
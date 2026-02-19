import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const noAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdminLoggedIn()) {
    router.navigate(['/dashboard'], { replaceUrl: true });
    return false;  
  }
  return true;
};

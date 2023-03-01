import { SignUp } from '@auth/controllers/signup';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    return this.router;
  }
}

export const authRoutes = new AuthRoutes();

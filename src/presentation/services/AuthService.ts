/**
 * Auth Service (Capa de Presentación)
 * Facade para autenticación
 */

import { SupabaseAuthService } from '../../infrastructure/supabase/SupabaseAuthService';

const authService = new SupabaseAuthService();

export class AuthService {
  static async getCurrentUser() {
    return await authService.getCurrentUser();
  }

  static async signIn(email: string, password: string) {
    return await authService.signIn(email, password);
  }

  static async signOut() {
    return await authService.signOut();
  }

  static async isAdmin() {
    return await authService.isAdmin();
  }
}

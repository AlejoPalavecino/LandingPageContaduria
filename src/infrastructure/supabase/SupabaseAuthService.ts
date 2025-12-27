/**
 * Implementación de AuthService con Supabase
 */

import { AuthService, User } from '../../domain/ports/AuthService';
import { supabase } from './client';

export class SupabaseAuthService implements AuthService {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
    };
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(`Error en login: ${error.message}`);
    if (!data.user) throw new Error('No se pudo iniciar sesión');

    return {
      id: data.user.id,
      email: data.user.email!,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Error cerrando sesión: ${error.message}`);
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error verificando admin: ${error.message}`);
    }

    return !!data;
  }
}

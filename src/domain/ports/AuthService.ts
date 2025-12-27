/**
 * Port: AuthService
 * Define el contrato para servicios de autenticación
 */

export interface User {
  id: string;
  email: string;
}

export interface AuthService {
  /**
   * Obtener el usuario actualmente autenticado
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Iniciar sesión
   */
  signIn(email: string, password: string): Promise<User>;

  /**
   * Cerrar sesión
   */
  signOut(): Promise<void>;

  /**
   * Verificar si el usuario actual es admin
   */
  isAdmin(): Promise<boolean>;
}

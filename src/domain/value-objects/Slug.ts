/**
 * Value Object: Slug
 * Representa un identificador URL-friendly
 */

export class Slug {
  private constructor(private readonly value: string) {
    if (!Slug.isValid(value)) {
      throw new Error(`Slug inválido: "${value}". Debe contener solo letras, números y guiones.`);
    }
  }

  static fromString(text: string): Slug {
    const slug = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .replace(/^-|-$/g, ''); // Remover guiones al inicio/fin

    return new Slug(slug);
  }

  static isValid(value: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length > 0;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}

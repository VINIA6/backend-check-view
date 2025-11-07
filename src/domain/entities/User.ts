export type UserRole = 'ADMIN' | 'VIEWER';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get avatar(): string | undefined {
    return this.props.avatar;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Métodos de negócio
  isAdmin(): boolean {
    return this.props.role === 'ADMIN';
  }

  isViewer(): boolean {
    return this.props.role === 'VIEWER';
  }

  // Retorna dados públicos (sem senha)
  toPublic() {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email,
      role: this.props.role,
      avatar: this.props.avatar,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}


export interface SharedLinkProps {
  id: string;
  projectId: string;
  token: string;
  expiresAt?: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SharedLink {
  private props: SharedLinkProps;

  private constructor(props: SharedLinkProps) {
    this.props = props;
  }

  static create(
    props: Omit<SharedLinkProps, 'id' | 'token' | 'createdAt' | 'updatedAt'>,
    id?: string,
    token?: string
  ) {
    const now = new Date();
    
    return new SharedLink({
      id: id || crypto.randomUUID(),
      token: token || crypto.randomUUID(), // Token separado do ID
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return new Date() > this.props.expiresAt;
  }

  isValid(): boolean {
    return this.props.isActive && !this.isExpired();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}


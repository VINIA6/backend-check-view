export interface AnnotationProps {
  id: string;
  videoId: string;
  userId?: string; // Opcional para convidados
  guestName?: string; // Nome do convidado
  guestEmail?: string; // Email do convidado
  timestamp: number; // in seconds
  comment: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Annotation {
  private props: AnnotationProps;

  private constructor(props: AnnotationProps) {
    this.props = props;
  }

  static create(props: Omit<AnnotationProps, 'id' | 'createdAt' | 'updatedAt'>, id?: string) {
    const now = new Date();
    return new Annotation({
      id: id || crypto.randomUUID(),
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string { return this.props.id; }
  get videoId(): string { return this.props.videoId; }
  get userId(): string | undefined { return this.props.userId; }
  get guestName(): string | undefined { return this.props.guestName; }
  get guestEmail(): string | undefined { return this.props.guestEmail; }
  get timestamp(): number { return this.props.timestamp; }
  get comment(): string { return this.props.comment; }
  get color(): string | undefined { return this.props.color; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  update(props: Partial<Omit<AnnotationProps, 'id' | 'videoId' | 'userId' | 'guestName' | 'guestEmail' | 'createdAt'>>) {
    Object.assign(this.props, { ...props, updatedAt: new Date() });
  }

  toJSON() {
    return {
      id: this.props.id,
      videoId: this.props.videoId,
      userId: this.props.userId,
      guestName: this.props.guestName,
      guestEmail: this.props.guestEmail,
      timestamp: this.props.timestamp,
      comment: this.props.comment,
      color: this.props.color,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  // Helper para identificar se foi criado por convidado
  isGuestAnnotation(): boolean {
    return !this.props.userId && !!this.props.guestName;
  }

  // Helper para obter nome do autor
  getAuthorName(): string {
    return this.props.guestName || 'Usuário';
  }
}


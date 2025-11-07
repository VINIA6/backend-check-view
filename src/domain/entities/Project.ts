export interface ProjectProps {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Project {
  private props: ProjectProps;

  private constructor(props: ProjectProps) {
    this.props = props;
  }

  static create(props: Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt'>, id?: string) {
    const now = new Date();
    return new Project({
      id: id || crypto.randomUUID(),
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get color(): string | undefined {
    return this.props.color;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(props: Partial<Omit<ProjectProps, 'id' | 'userId' | 'createdAt'>>) {
    Object.assign(this.props, { ...props, updatedAt: new Date() });
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      color: this.props.color,
      userId: this.props.userId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}


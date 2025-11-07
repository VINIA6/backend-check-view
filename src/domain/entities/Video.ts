export interface VideoProps {
  id: string;
  name: string;
  url?: string;
  filePath?: string;
  duration: number;
  thumbnail?: string;
  projectId: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export class Video {
  private props: VideoProps;

  private constructor(props: VideoProps) {
    this.props = props;
  }

  static create(props: Omit<VideoProps, 'id' | 'uploadedAt' | 'updatedAt'>, id?: string) {
    const now = new Date();
    return new Video({
      id: id || crypto.randomUUID(),
      ...props,
      uploadedAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get url(): string | undefined {
    return this.props.url;
  }

  get filePath(): string | undefined {
    return this.props.filePath;
  }

  get duration(): number {
    return this.props.duration;
  }

  get thumbnail(): string | undefined {
    return this.props.thumbnail;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get uploadedAt(): Date {
    return this.props.uploadedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(props: Partial<Omit<VideoProps, 'id' | 'projectId' | 'uploadedAt'>>) {
    Object.assign(this.props, { ...props, updatedAt: new Date() });
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      url: this.props.url,
      filePath: this.props.filePath,
      duration: this.props.duration,
      thumbnail: this.props.thumbnail,
      projectId: this.props.projectId,
      uploadedAt: this.props.uploadedAt,
      updatedAt: this.props.updatedAt,
    };
  }
}


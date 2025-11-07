import { Annotation } from '../entities/Annotation';

export interface CreateAnnotationDTO {
  videoId: string;
  userId?: string; // Opcional para convidados
  guestName?: string;
  guestEmail?: string;
  timestamp: number;
  comment: string;
  color?: string;
}

export interface UpdateAnnotationDTO {
  timestamp?: number;
  comment?: string;
  color?: string;
}

export interface IAnnotationRepository {
  create(data: CreateAnnotationDTO): Promise<Annotation>;
  findById(id: string): Promise<Annotation | null>;
  findByVideoId(videoId: string): Promise<Annotation[]>;
  findByUserId(userId: string): Promise<Annotation[]>;
  update(id: string, data: UpdateAnnotationDTO): Promise<Annotation>;
  delete(id: string): Promise<void>;
  deleteByVideoId(videoId: string): Promise<void>;
}


import {User} from './user';
import {Category} from './category';
import {PetitionFile} from './petition-file';

export interface Petition {
  id?: number;
  title: string;
  description: string;
  destinatary: string;
  user_id?: number;
  category_id?: number;
  signers?: number;
  status?: string;
  created_at?: Date;

  // Array de objetos PeticionFile
  files?: PetitionFile[];

  // Relaciones opcionales
  category?: Category;
  user?: User;
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(() => Photo, (photo: Photo) => photo.author) // Association un à plusieurs
  photos: Photo[]
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Author } from './Author';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column("text")
  description: string

  @Column()
  filename: string

  @Column()
  views: number

  @Column()
  isPublished: boolean

  @ManyToOne(() => Author, (author: Author) => author.photos) // Association plusieurs à un
  author: Author
}

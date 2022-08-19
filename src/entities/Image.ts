import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    name: string

    @Column({type: 'long'})
    data: Blob
}
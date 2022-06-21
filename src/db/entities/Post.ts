import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
	JoinTable,
	JoinColumn,
} from 'typeorm';

import { ETypePost } from '../../enums/postEnums';

import Group from './Group';
import Photo from './Photo';
import User from './User';

@Entity('post')
export default class Post extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ nullable: false, unique: true })
	text: string;

	@Column({ nullable: false })
	title: string;

	@Column({ enum: ETypePost, nullable: false })
	typePost: ETypePost;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// relations

	// user
	@ManyToOne(() => User, user => user.posts, { onDelete: 'SET NULL' })
	@JoinColumn()
	creator: User;

	@ManyToMany(() => User, { onDelete: 'CASCADE' })
	@JoinTable()
	likes: User[];
	// user

	// group
	@ManyToOne(() => Group, group => group.posts, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	group: Group;
	// group

	// photo
	@OneToMany(() => Photo, photo => photo.post, {
		nullable: true,
		cascade: true,
	})
	@JoinColumn()
	photos: Photo[];

	// photo

	// relations
}

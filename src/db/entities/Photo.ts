import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToOne,
} from 'typeorm';
import Post from './Post';
import User from './User';
import Group from './Group';

import { EAccessTypePhoto, ETypePhoto } from '../../enums/photoEnums';

@Entity('photo')
export default class Photo extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ nullable: false })
	url: string;

	@Column({ nullable: true })
	description: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column({ type: 'enum', nullable: false, enum: ETypePhoto })
	photo_type: ETypePhoto;

	@Column({
		type: 'enum',
		enum: EAccessTypePhoto,
		default: EAccessTypePhoto.public,
	})
	access: EAccessTypePhoto;

	@Column({ nullable: true })
	queue_place: number;

	// post
	@ManyToOne(() => Post, post => post.photos, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	post: Post;
	// post

	// group
	@ManyToOne(() => Group, group => group.photos, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	group: Group;

	@OneToOne(() => Group, group => group.main_photo, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	main_group_photo: Group;
	// group

	// user
	@ManyToOne(() => User, user => user.photos, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	user: User;

	@OneToOne(() => User, user => user.main_photo, {
		nullable: true,
	})
	main_user_photo: User;
	// user
}

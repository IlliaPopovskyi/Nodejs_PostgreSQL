import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	OneToOne,
	OneToMany,
	ManyToMany,
	ManyToOne,
	JoinTable,
} from 'typeorm';

import { EAccessGroup, ETypeBlog } from '../../enums/groupEnums';

import Photo from './Photo';
import Post from './Post';
import User from './User';

@Entity('group')
export default class Group extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ nullable: false })
	title: string;

	@Column({ enum: EAccessGroup, default: EAccessGroup.public })
	accessType: EAccessGroup;

	@Column({ enum: ETypeBlog, default: ETypeBlog.forum })
	blogType: ETypeBlog;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// relations

	// user
	@ManyToOne(() => User, user => user.my_groups, { onDelete: 'CASCADE' })
	@JoinColumn()
	admin: User;

	@ManyToMany(() => User, user => user.moder_groups)
	@JoinTable()
	moderators: User[];
	// user

	// post
	@OneToMany(() => Post, post => post.group)
	@JoinColumn()
	posts: Post[];
	// post

	// photo
	@OneToMany(() => Photo, photo => photo.group)
	@JoinColumn()
	photos: Photo[];

	@OneToOne(() => Photo, photo => photo.main_group_photo, { cascade: true })
	@JoinColumn()
	main_photo: Photo;
	// photo

	// relations
}

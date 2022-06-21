import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	OneToMany,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import Group from './Group';
import Photo from './Photo';
import Post from './Post';

@Entity('user')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ nullable: false, unique: true })
	user_name: string;

	@Column({ nullable: true })
	first_name: string;

	@Column({ nullable: true })
	middle_name: string;

	@Column({ nullable: true, default: null })
	last_name: string;

	@Column({ nullable: false, unique: true })
	email: string;

	@Column({ nullable: false, select: false })
	password: string;

	@Column({ default: false })
	verified: boolean;

	@Column({ select: false, nullable: false })
	verify_code: number;

	@Column({ select: false, nullable: true })
	recovery_code: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// relations

	// post
	@OneToMany(() => Post, post => post.creator)
	posts: Post[];
	// post

	// group
	@OneToMany(() => Group, group => group.admin)
	my_groups: Group[];

	@ManyToMany(() => Group, group => group.moderators)
	moder_groups: Group[];
	// group

	// photo
	@OneToMany(() => Photo, photo => photo.user)
	@JoinColumn()
	photos: Photo[];

	@OneToOne(() => Photo, photo => photo.main_user_photo, {
		cascade: true,
	})
	@JoinColumn()
	main_photo: Photo;
	// photo

	// relations
}

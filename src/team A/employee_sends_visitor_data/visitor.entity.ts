import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsEmail, IsDateString, IsOptional } from "class-validator";

@Entity()
export class Visitor {
    @PrimaryGeneratedColumn()
    @IsOptional() // ✅ This allows id to exist but ignores it in validation
    id: number;

    @Column()
    @IsString()
    firstName: string;

    @Column()
    @IsString()
    lastName: string;

    @Column()
    @IsString()
    phoneNumber: string;

    @Column()
    @IsString()
    nationalId: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({ type: "time" })
    @IsString()
    allocationTime: string;

    @Column({ type: "date" })
    @IsDateString()
    date: string;
}

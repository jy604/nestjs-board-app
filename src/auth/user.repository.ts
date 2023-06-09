import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
    }

    async createUser(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = AuthCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = this.create({ username, password: hashedPassword });

        try {
            await this.save(user);
        } catch (error) {
            // error.code === 'ER_DUP_ENTRY' mysql 연결시 코드
            // error.code === '23505' postgres 연결시 코드
            // error.errno === 1062
            if(error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }


            console.log('error', error);
        }
    }

}
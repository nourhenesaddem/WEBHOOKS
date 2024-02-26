import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Webhook } from "../webhook/Entity/webhook.entity";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

  private users: User[] = [];

  //create(createUserDto: CreateUserDto): Promise<User> {
  //  const webhook = this.userRepository.create(createUserDto);
  //  return this.userRepository.save(webhook);
  //}
  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findById(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async findOne(condition: any): Promise<User> {
    return await this.userRepository.findOne(condition);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const options: FindOneOptions<User> = { where: { email } }; // Define options for the findOne method
    return this.userRepository.findOne(options);
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
    const { firstName, lastName, email, password, organizationId} = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      organizationId,
    });
    const savedUser = await this.userRepository.save(newUser);
    // Exclude password field from the returned user object
    const { password: _, ...user } = savedUser;
    return user;
  }
  findAll() {
    return `This action returns all user`;
    // a voir !!
    //return this.users.map((user) => new SerializedUser(user))

  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}

  //async login(email: string, password: string): Promise<string> {
  //  // Find user by email
  //  const user = await this.findByEmail(email);
  //  if (!user) {
  //    throw new BadRequestException('Invalid credentials');
  //  }
  //  // Compare hashed password with input password
  //  const isPasswordValid = await bcrypt.compare(password, user.password);
  //  if (!isPasswordValid) {
  //    throw new BadRequestException('Invalid credentials');
  //  }
  //  const jwt = await this.jwtService.signAsync({id: user.OrganizationId});
  //  response.cookie('jwt', jwt,{httpOnly:true});
  //  return jwt;
  //}
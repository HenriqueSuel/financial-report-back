import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs'
import User from '../models/Users'
import AppError from '../errors/AppError'
import authConfig from '../config/auth';
import { sign } from 'jsonwebtoken'


interface Request {
  name: string,
  email: string,
  password: string,
}

interface authencticate {
  user:User,
  token: string
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    })

    if (checkUserExists) {
      throw new AppError('Email já está sendo usado', 400)
    }

    const hashedPassword = await hash(password, 8);


    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword
    })

    await usersRepository.save(user);

    return user;
  }

  public async authencticateUser({ email, password }: Omit<Request, 'name'>): Promise<authencticate> {
    const usersRespository = getRepository(User);

    const user = await usersRespository.findOne({ where: { email }})

    if(!user){
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const token = sign({  }, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn:authConfig.jwt.expiresIn
    });

    return {
      user,
      token
    }
  }
}

export default CreateUserService

import { Router, request, response } from 'express';
import CreateUserService from '../services/UsersService';

const usersRouter = Router();

usersRouter.post('/auth', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();

  const { user, token  } = await createUser.authencticateUser({
    email,
    password
  })

  delete user.password;

  response.json({ user, token })
});


usersRouter.post('/', async(request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password
  })

  delete user.password;

  response.json(user)
})

export default usersRouter;

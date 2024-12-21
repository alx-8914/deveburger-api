/* O Controller é uma Classe; segue métodos:
* store => Cadastar / Adicionar
* index => Listar vários
* show  => Listar apenas um
* update => Atualizar
* delete => Deletar

*/
import { v4 } from 'uuid';
import * as Yup from 'yup'
import bcrypt from 'bcryptjs'
import User from './models/User'

class UserController{
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });
    
    try {
      await schema.validateSync(request.body, { abortEarly: false});
    }catch(err) {
      return response.status(400).json({ error: err.errors});
    }
     
    const {name, email, password, admin} = request.body;

    const userExists = await User.findOne({
      where: { 
        email,
       },
    });
    
    if (userExists) {
      return response.status(409).json({ error: 'User already exists'})
    }

      // Encripta a senha usando bcrypt
      const password_hash = await bcrypt.hash(password, 10);
 
    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash, // Armazena a senha encriptada como `password_hash`
      admin: admin || false, // Define `false` como valor padrão se `admin` não for enviado
    });
    
    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin
    });
  }
}
export default new UserController
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export function authMiddleware(request, response, next) {
  const authToken = request.headers.authorization;

  // Verifica se o token foi fornecido
  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  // Divide o token e verifica se ele está no formato correto (Bearer <token>)
  const [bearer, token] = authToken.split(' ');

  // Verifica se o formato do token está correto
  if (bearer !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Token malformatted' });
  }

  // Verifica o token JWT
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: 'Token is invalid' });
    }

    // Token válido, armazena informações do usuário na requisição
    request.userId = decoded.id;
    request.userName = decoded.name;

    // Passa para a próxima função (controller)
    return next();
  });
}

export default authMiddleware;

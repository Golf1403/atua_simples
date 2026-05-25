export default (group?: string) => {
  switch (group) {
    case 'owner':
      return 'Administrador do sistema';
    case 'admin':
      return 'Administrador';
    case 'user':
      return 'Usuário';
    default:
      return 'Convidado';
  }
};

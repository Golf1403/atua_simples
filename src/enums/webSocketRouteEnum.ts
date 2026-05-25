enum webSocketRouteEnum {
  CONNECT = '$connect',
  DISCONNECT = '$disconnect',
  MESSAGE = '$default',
}

enum webSocketMessageRouteEnum {
  CREATE_SESSION = 'create_session',
  DISCONNECT_SESSION = 'disconnect_session',
  REFRESH_SESSION = 'refresh_session',
}

enum webSocketMessageRouteSuccessPtBrEnum {
  SET_DATA_AUTH = 'sucesso ao atualizar dados de autênticação',
  GET_DATA_AUTH = 'sucesso ao pegar dados de autênticação',
  LOGIN = 'sucesso ao autênticar usuário',
  RESET = `sucesso ao resetar banco`,
  GET_DB = `sucesso ao pegar banco`,
}

enum webSocketMessageRouteErrorPtBrEnum {
  LOGIN = 'erro ao autênticar usuário',
  SET_DATA_AUTH = 'erro ao atualizar dados de autênticação',
  GET_DATA_AUTH = 'erro ao pegar dados de autênticação',
  RESET = `erro ao resetar banco`,
  GET_DB = `erro ao pegar banco`,
  DEFAULT = `erro interno`,
}

enum webSocketRouteSuccessPtBrEnum {
  CONNECT = 'sucesso ao conectar',
  DISCONNECT = 'sucesso ao desconectar',
  MESSAGE = 'sucesso ao receber mensagem',
  DEFAULT = 'sucesso interno',
}

enum webSocketRouteStatusPtBrEnum {
  SET_DATA_AUTH = 206,
  GET_DATA_AUTH = 202,
  CONNECT = 201,
  DISCONNECT = 205,
  MESSAGE = 204,
  DEFAULT = 200,
}

enum webSocketRouteStatusErrorPtBrEnum {
  CONNECT = 403,
  SET_DATA_AUTH = 406,
  GET_DATA_AUTH = 402,
  DISCONNECT = 401,
  MESSAGE = 400,
  DEFAULT = 413,
}

enum webSocketRouteErrosPtBrEnum {
  CONNECT = 'erro ao conectar',
  DISCONNECT = 'erro ao desconectar',
  MESSAGE = 'erro ao receber mensagem',
  DEFAULT = 'erro interno',
}

enum webSocketRoutePtBrEnum {
  CONNECT = 'conectado',
  DISCONNECT = 'desconectado',
  MESSAGE = 'menssagem',
}

export {
  webSocketRouteEnum,
  webSocketRoutePtBrEnum,
  webSocketMessageRouteEnum,
  webSocketRouteErrosPtBrEnum,
  webSocketRouteSuccessPtBrEnum,
  webSocketRouteStatusPtBrEnum,
  webSocketMessageRouteSuccessPtBrEnum,
  webSocketMessageRouteErrorPtBrEnum,
  webSocketRouteStatusErrorPtBrEnum,
};

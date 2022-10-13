let activeUsers = [];

export const setUsers = (user) => {
  const exist = activeUsers.find((item) => item.userId == user.userId);

  if (!exist) {
    activeUsers.push(user);
  } else {
    exist.socketId = user.socketId;
  }

  return {
    new: user,
    disconnect: null,
    active: activeUsers,
  };
};

export const disconnect = (socketId) => {
  const exist = activeUsers.find((item) => item.socketId == socketId);
  if (exist) {
    activeUsers = activeUsers.filter((item) => item.socketId != exist.socketId);
  }
  return {
    disconnected: exist,
    new: null,
    active: activeUsers,
  };
};

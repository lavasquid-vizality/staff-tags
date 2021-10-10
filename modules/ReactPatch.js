export default (oldFunction, newFunction, newArgsFunction, patched) => {
  const _Type = oldFunction?.type;
  if (!_Type || typeof _Type !== 'function' || _Type.patched) return;
  oldFunction.type = (...args) => {
    if (newArgsFunction) {
      const newArgs = newArgsFunction(...args);
      args[0] = {
        ...args[0],
        ...newArgs
      };
    }
    const Type = _Type(...args);
    if (newFunction) newFunction(Type);
    return Type;
  };
  oldFunction.type.displayName = _Type.displayName;
  if (patched) oldFunction.type.patched = true;
};

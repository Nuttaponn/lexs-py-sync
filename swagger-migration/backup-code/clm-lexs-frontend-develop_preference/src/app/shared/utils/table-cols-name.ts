// for generate table columns name
export const columnsName = (_index: number, _name?: string) => {
  let result = [];
  for (let i = 0; i < _index; i++) {
    result.push(_name ? _name : 'lexsColName' + i);
  }
  return result;
};

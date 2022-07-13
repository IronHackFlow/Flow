export const calculateButtonSize = (_height: number, _width: number, _offset: number): number[] => {
  let height = 0
  let width = 0
  if (_height <= _width) {
    height = _height - _offset
    width = _height - _offset
  } else {
    height = _width - _offset
    width = _width - _offset
  }
  return [height, width]
}

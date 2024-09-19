export const eventHasValidPoint = (event: mapboxgl.Event): event is mapboxgl.Event & {
  point: { x: number, y: number }
} => (
  'point' in event &&
  !!event.point &&
  typeof event.point === 'object' &&
  'x' in event.point &&
  typeof event.point.x === 'number' &&
  event.point.x !== null &&
  'y' in event.point &&
  typeof event.point.y === 'number' &&
  event.point.y !== null
)
/** Настройки не зависят от React и не изменяют данные графа. */
export const DEFAULT_GRAPH_SETTINGS = Object.freeze({
  particleCount: 0,
  particleSpeed: 0.005,
  nodeSize: 4,
  showArrows: false,
});

function validateNumber(value, name, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) ||
      value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new RangeError(`${name}: ожидается ${integer ? 'целое число' : 'число'} от ${min} до ${max}.`);
  }
}

function validateSettings(settings) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new TypeError('Настройки должны быть объектом.');
  }
  validateNumber(settings.particleCount, 'Количество шариков', 0, 5, true);
  validateNumber(settings.particleSpeed, 'Скорость шариков', 0, 0.03);
  validateNumber(settings.nodeSize, 'Размер узлов', 2, 16, true);
  if (typeof settings.showArrows !== 'boolean') {
    throw new TypeError('showArrows должен быть true или false.');
  }
}

/** Количество шариков на каждой связи; 0 выключает шарики. */
export function setParticleCount(settings, count) {
  validateSettings(settings);
  validateNumber(count, 'Количество шариков', 0, 5, true);
  return { ...settings, particleCount: count };
}

/** Скорость: доля длины связи за кадр; 0 останавливает шарики. */
export function setParticleSpeed(settings, speed) {
  validateSettings(settings);
  validateNumber(speed, 'Скорость шариков', 0, 0.03);
  return { ...settings, particleSpeed: speed };
}

/** Базовый размер узлов; в ForceGraph фактический размер зависит также от nodeVal. */
export function setNodeSize(settings, size) {
  validateSettings(settings);
  validateNumber(size, 'Размер узлов', 2, 16, true);
  return { ...settings, nodeSize: size };
}

/** Включить или выключить стрелки направления source → target. */
export function setArrowsEnabled(settings, enabled) {
  validateSettings(settings);
  if (typeof enabled !== 'boolean') throw new TypeError('enabled должен быть true или false.');
  return { ...settings, showArrows: enabled };
}

/** Подготовить настройки для react-force-graph-2d. */
export function getForceGraphProps(settings) {
  validateSettings(settings);
  return {
    nodeRelSize: settings.nodeSize,
    linkDirectionalParticles: settings.particleCount,
    linkDirectionalParticleSpeed: settings.particleSpeed,
    linkDirectionalArrowLength: settings.showArrows ? 5 : 0,
    linkDirectionalArrowRelPos: 0.95,
  };
}

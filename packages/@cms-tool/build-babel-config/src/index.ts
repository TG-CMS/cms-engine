import {getPreset} from './preset'
export * from './preset'
export default () => {
  return getPreset({
    vue:true,
    typescript: true,
    env: {
      modules: false,
      useBuiltIns: 'entry',
      corejs: '3.7',
    }
  });
};

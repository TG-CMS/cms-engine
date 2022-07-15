import * as camelCase from 'camelcase';
import * as decamelize from 'decamelize';
import * as uppercamelcase from 'uppercamelcase';
import * as validateName from 'validate-npm-package-name';
export function decamelizeName(name:string){
  return  decamelize(name, {separator: '-'})
}
export function parseNpmName(npmName:string=''){
  const name = npmName.split('/')[1] || npmName.split('/')[0];
  return  camelCase(name, { pascalCase: true });
}
export function parseNpmScope(npmName: string){
  const name=npmName.split('/');
  if (name.length>1)return npmName.split('/')[0];
   return null;
}
export  function generateNpmName(name: string, npmScope?: string): string {
  // WebkitTransform -> webkit-transform
  name = decamelize(name, {separator: '-'});
  return npmScope ? `${npmScope}/${name}` : name;
}
export function validateNpmName(npmName){
  if (!validateName(npmName).validForNewPackages) {
    return `NPM package name ${npmName} not validate, please retry`;
  }
  return  true
}
export {uppercamelcase,camelCase};

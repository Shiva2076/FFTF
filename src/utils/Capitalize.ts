export function formatUnderscoreString(str:string) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
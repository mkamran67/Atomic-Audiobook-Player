export function convertURI(uriToConvert: string) {

  const encodedUri = encodeURIComponent(uriToConvert);

  return `potato://image-${encodedUri}`;
}


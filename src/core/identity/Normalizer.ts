import { parse } from 'tldts';
import { NormalizedResourceIdentity } from './types';

export class IdentityNormalizer {
  public static normalize(rawInput: string): NormalizedResourceIdentity {
    const trimmed = rawInput.trim();
    let urlString = trimmed;
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = `https://${urlString}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlString);
    } catch {
      parsedUrl = new URL('https://invalid.local');
    }

    const tldResult = parse(parsedUrl.hostname);
    const hostname = (tldResult.hostname || parsedUrl.hostname).toLowerCase();
    const domain = (tldResult.domain || '').toLowerCase();
    const publicSuffix = (tldResult.publicSuffix || '').toLowerCase();
    const isIp = Boolean(tldResult.isIp);
    const punycode = hostname.includes('xn--');

    const canonicalUrl = `${parsedUrl.protocol}//${hostname}${parsedUrl.pathname}${parsedUrl.search}`;

    return {
      rawInput,
      canonicalUrl,
      hostname,
      domain,
      publicSuffix,
      path: parsedUrl.pathname,
      query: parsedUrl.search,
      isIp,
      punycode,
      scheme: parsedUrl.protocol.replace(':', ''),
    };
  }
}

import { parse } from 'tldts';
import { NormalizedResourceIdentity } from './types';

export interface CanonicalizationOptions {
  readonly stripDefaultPorts?: boolean;
  readonly stripFragment?: boolean;
  readonly stripUserInfo?: boolean;
  readonly lowercaseSchemeAndHost?: boolean;
}

export class IdentityNormalizer {
  /**
   * RFC 3986-compliant deterministic URL identity normalizer.
   * Strips deceptive credentials, standardizes default ports, resolves relative navigation dots,
   * and extracts Public Suffix / Punycode traits.
   */
  public static normalize(
    rawInput: string,
    options: CanonicalizationOptions = {
      stripDefaultPorts: true,
      stripFragment: true,
      stripUserInfo: true,
      lowercaseSchemeAndHost: true,
    }
  ): NormalizedResourceIdentity {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return {
        rawInput: '',
        canonicalUrl: '',
        hostname: '',
        domain: '',
        publicSuffix: '',
        path: '/',
        query: '',
        isIp: false,
        punycode: false,
        scheme: 'none',
      };
    }

    let urlString = trimmed;
    // Auto-prepend https:// if no scheme is specified
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(urlString)) {
      urlString = `https://${urlString}`;
    }

    let parsed: URL;
    try {
      parsed = new URL(urlString);
    } catch {
      // Fallback for malformed inputs
      try {
        parsed = new URL(`https://${encodeURI(trimmed)}`);
      } catch {
        parsed = new URL('https://malformed.local');
      }
    }

    // Clean trailing dots in FQDNs (e.g. google.com. -> google.com)
    let cleanHostname = parsed.hostname.replace(/\.+$/, '');
    if (options.lowercaseSchemeAndHost) {
      cleanHostname = cleanHostname.toLowerCase();
    }

    // Identify if hostname is raw IPv4 / IPv6
    const isIpv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(cleanHostname);
    const isIpv6 = cleanHostname.startsWith('[') && cleanHostname.endsWith(']');
    const isIp = isIpv4 || isIpv6;

    // tldts extraction for domain and public suffix
    const tldResult = parse(cleanHostname);
    const hostname = tldResult.hostname || cleanHostname;
    const domain = (tldResult.domain || (isIp ? cleanHostname : '')).toLowerCase();
    const publicSuffix = (tldResult.publicSuffix || '').toLowerCase();
    const punycode = hostname.includes('xn--');

    // Standardize port: remove 80 for http, 443 for https
    let port = parsed.port;
    if (options.stripDefaultPorts) {
      if ((parsed.protocol === 'http:' && port === '80') || (parsed.protocol === 'https:' && port === '443')) {
        port = '';
      }
    }

    const hostHeader = port ? `${hostname}:${port}` : hostname;
    const scheme = parsed.protocol.replace(':', '').toLowerCase();

    // Standardize path & query
    let pathname = parsed.pathname || '/';
    // Normalize consecutive slashes
    pathname = pathname.replace(/\/{2,}/g, '/');
    const query = parsed.search || '';

    // Reconstruct canonical URL (stripping userinfo auth like admin:pass@)
    const canonicalUrl = `${scheme}://${hostHeader}${pathname}${query}`;

    return {
      rawInput,
      canonicalUrl,
      hostname,
      domain,
      publicSuffix,
      path: pathname,
      query,
      isIp,
      punycode,
      scheme,
    };
  }
}

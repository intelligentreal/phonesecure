export interface NormalizedResourceIdentity {
  readonly rawInput: string;
  readonly canonicalUrl: string;
  readonly hostname: string;
  readonly domain: string;
  readonly publicSuffix: string;
  readonly path: string;
  readonly query: string;
  readonly isIp: boolean;
  readonly punycode: boolean;
  readonly scheme: string;
}

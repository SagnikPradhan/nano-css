/**
 * Renderer Options
 */
interface RendererOptions {
  prefix?: string;
  styleSheet?: HTMLStyleElement;
  useInsertRule?: boolean;
}

/**
 * Browser only nano-css renderer
 */
export class Renderer {
  stylesheet: HTMLStyleElement;
  useInsertRule: boolean;

  private dev: boolean;

  /**
   * Create new renderer
   * @param options - Renderer Options
   */
  constructor(options: RendererOptions) {
    // Check environment
    const isBrowser =
      typeof window !== 'undefined' &&
      typeof document === 'object' &&
      !document.getElementsByTagName('HTML');
    if (!isBrowser) throw new Error('Renderer only supports browsers!');

    // Our stylesheet
    this.stylesheet = options.styleSheet || document.createElement('style');
    if (!document.head.contains(this.stylesheet))
      document.head.append(this.stylesheet);
    if (this.stylesheet.sheet === null)
      throw new Error('Expected sheet to be defined');

    // Development mode
    this.dev = process.env.NODE_ENV !== 'production';

    // .insertRule() is faster than .appendChild()
    // But CSS injected using .insertRule() is not displayed in Chrome Dev-tools,
    // By default we use insertRule only in production
    this.useInsertRule = options.useInsertRule ?? !this.dev;
  }

  /**
   * Internal method to add rules
   * @param rule - Rule to be added
   */
  private internalPut(rule: string) {
    if (this.useInsertRule) {
      // Unknown pseudo-selectors will throw, this try/catch swallows all errors.
      try {
        const sheet = this.stylesheet.sheet!;
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {}
    } else this.stylesheet.append(document.createTextNode(rule));
  }
}

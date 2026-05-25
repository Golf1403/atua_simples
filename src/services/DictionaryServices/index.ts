import PT_BR from './locales/pt-br';

type ILocale = 'pt-br';

export default class Dictionary {
  private locale: ILocale;

  constructor(locale: ILocale = 'pt-br') {
    this.locale = locale;
  }

  public translate(initial: string) {
    switch (this.locale) {
      case 'pt-br':
        return this.translate_pt_br(initial);
      default:
        return initial;
    }
  }

  private translate_pt_br(initial: string) {
    const translated = PT_BR[initial];

    if (!translated) return initial;

    return translated;
  }
}

import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

const localesPath = path.join(__dirname, '..', 'locales');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'am'],
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json')
    },
    detection: {
      order: ['querystring', 'header'],
      lookupQuerystring: 'lang'
    }
  });

export const i18nMiddleware = middleware.handle(i18next);
export { i18next };

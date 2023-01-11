import sanitize from 'sanitize-html';

export const sanitizeHtml = (html: string, options?: sanitize.IOptions) => sanitize(html, options);

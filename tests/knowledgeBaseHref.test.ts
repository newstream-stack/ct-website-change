import assert from 'node:assert/strict';
import test from 'node:test';
import { redactLockedHref } from '../src/utils/knowledgeBaseHref.ts';
import type { KnowledgeArticle } from '../src/types/knowledgeBase.ts';

const article: KnowledgeArticle = {
  id: 1,
  year: 2018,
  date: '2018-10-17',
  source: '基督教論壇報',
  author: '記者',
  title: '標題',
  href: 'https://ct.org.tw/html/news/3-3.php?article=1396835&cat=10',
  image: 'https://example.com/image.jpg',
};

test('redactLockedHref keeps href for subscribers', () => {
  assert.equal(redactLockedHref(article, true).href, article.href);
});

test('redactLockedHref strips href for non-subscribers so no usable URL leaks', () => {
  const locked = redactLockedHref(article, false);
  assert.equal(locked.href, '');
  assert.equal(locked.title, article.title);
});

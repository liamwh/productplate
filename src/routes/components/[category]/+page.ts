import { categories } from '../registry';

export const prerender = true;
export const entries = () => categories.map((category) => ({ category: category.id }));

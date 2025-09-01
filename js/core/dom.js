export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const on = (el, ev, cb, opts) => el?.addEventListener(ev, cb, opts);
export const cssvar = (name, val) => document.documentElement.style.setProperty(name, val);

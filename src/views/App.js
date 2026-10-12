import React from "react";
import { SITE, PAGES, categoryBySlug } from "../../shared/site.js";
import { h, NavContext, Header, Footer } from "./components.js";
import { Home, TopicsIndex, Topic, Article, StaticPage, Contact, Search, NotFound } from "./pages.js";
import { Admin } from "../admin/Admin.js";

export function parseUrl(url) {
  var i = url.indexOf("?");
  var path = (i === -1 ? url : url.slice(0, i)) || "/";
  if (path.length > 1) path = path.replace(/\/+$/, "");
  var query = {};
  if (i !== -1) url.slice(i + 1).split("&").forEach(function (kv) {
    if (!kv) return;
    var p = kv.split("=");
    try { query[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); } catch (e) {}
  });
  return { path: path, query: query };
}

// Works out which page a URL is. Shared by the server and the browser.
export function route(url) {
  var u = parseUrl(url);
  var p = u.path;
  if (p === "/") return { name: "home" };
  if (p === "/topics") return { name: "topics" };
  if (p.indexOf("/topics/") === 0) return { name: "topic", slug: p.slice(8) };
  if (p.indexOf("/article/") === 0) { var slug = p.slice(9); try { slug = decodeURIComponent(slug); } catch (e) {} return { name: "article", slug: slug }; }
  if (p === "/search") return { name: "search", query: u.query.q || "" };
  if (p === "/contact") return { name: "contact" };
  if (p === "/admin") return { name: "admin" };
  var key = p.slice(1);
  if (PAGES[key]) return { name: "page", page: key };
  return { name: "notfound" };
}

export function titleFor(r, data) {
  var base = SITE.name;
  if (r.name === "home") return "NaturalWell: home remedies, checked against the evidence";
  if (r.name === "topics") return "Topics | " + base;
  if (r.name === "topic") { var c = categoryBySlug(r.slug); return c ? c.name + ": natural remedies and what the evidence says | " + base : "Not found | " + base; }
  if (r.name === "article") return data.article && data.article.title ? data.article.title + " | " + base : "Article not found | " + base;
  if (r.name === "search") return "Search | " + base;
  if (r.name === "contact") return "Contact | " + base;
  if (r.name === "page") return PAGES[r.page].title + " | " + base;
  if (r.name === "admin") return "Admin | " + base;
  return "Page not found | " + base;
}

export function App(props) {
  var urlState = React.useState(props.url);
  var url = urlState[0];
  var dataState = React.useState(props.data || { articles: [], article: null });
  var data = dataState[0];
  var setData = dataState[1];
  var loadingState = React.useState(!(props.data && props.data.articles && props.data.articles.length));
  var r = route(url);

  var navigate = React.useCallback(function (to, opts) {
    if (typeof window === "undefined") return;
    var same = to === window.location.pathname + window.location.search;
    if (!same) window.history[opts && opts.replace ? "replaceState" : "pushState"]({}, "", to);
    urlState[1](to);
    if (to.indexOf("#") === -1) window.scrollTo(0, 0);
  }, []);

  // Back / forward buttons.
  React.useEffect(function () {
    function onPop() { urlState[1](window.location.pathname + window.location.search); }
    window.addEventListener("popstate", onPop);
    return function () { window.removeEventListener("popstate", onPop); };
  }, []);

  // Load the article list if the server didn't include it.
  React.useEffect(function () {
    if (data.articles && data.articles.length) return;
    fetch("/api/articles?meta=1").then(function (res) { return res.json(); }).then(function (list) {
      if (Array.isArray(list)) setData(function (d) { return Object.assign({}, d, { articles: list }); });
    }).catch(function () {}).then(function () { loadingState[1](false); });
  }, []);

  // Load the full text when an article is opened from within the site.
  React.useEffect(function () {
    if (r.name !== "article") return;
    if (data.article && data.article.slug === r.slug) return;
    fetch("/api/articles?slug=" + encodeURIComponent(r.slug)).then(function (res) { return res.ok ? res.json() : null; }).then(function (a) {
      setData(function (d) { return Object.assign({}, d, { article: a || { missing: r.slug } }); });
    }).catch(function () {});
  }, [r.name, r.slug]);

  React.useEffect(function () { document.title = titleFor(r, data); }, [url, data.article]);

  var article = r.name === "article" && data.article && data.article.slug === r.slug ? data.article : null;
  var articleMissing = r.name === "article" && data.article && data.article.missing === r.slug;
  var page;
  if (r.name === "home") page = h(Home, { articles: data.articles, loading: loadingState[0] });
  else if (r.name === "topics") page = h(TopicsIndex, { articles: data.articles });
  else if (r.name === "topic") page = h(Topic, { slug: r.slug, articles: data.articles, loading: loadingState[0] });
  else if (r.name === "article") page = h(Article, { article: article, articles: data.articles, loading: !articleMissing });
  else if (r.name === "search") page = h(Search, { query: r.query, articles: data.articles });
  else if (r.name === "contact") page = h(Contact);
  else if (r.name === "page") page = h(StaticPage, { page: r.page });
  else if (r.name === "admin") page = h(Admin, { onArticlesChanged: function (list) { setData(function (d) { return Object.assign({}, d, { articles: list, article: null }); }); } });
  else page = h(NotFound);

  return h(NavContext.Provider, { value: { path: parseUrl(url).path, navigate: navigate } },
    h(Header, { progress: r.name === "article" }),
    h("main", { id: "main" }, page),
    r.name === "admin" ? null : h(Footer)
  );
}

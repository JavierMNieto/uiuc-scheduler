if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return c[e]||(s=new Promise((async s=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]}))},s=(s,c)=>{Promise.all(s.map(e)).then((e=>c(1===e.length?e[0]:e)))},c={require:Promise.resolve(s)};self.define=(s,n,i)=>{c[s]||(c[s]=Promise.resolve().then((()=>{let c={};const o={uri:location.origin+s.slice(1)};return Promise.all(n.map((s=>{switch(s){case"exports":return c;case"module":return o;default:return e(s)}}))).then((e=>{const s=i(...e);return c.default||(c.default=s),c}))})))}}define("./sw.js",["./workbox-7797d470"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/0f1ac474.5fbc4a4fb93e2312336c.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/19.104c5952bfe6b4139a4f.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/20.5ee6827fee73e223378a.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/21.28f28e572e3c5861dddd.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/22.7293da0105ca140551eb.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/29107295.8a546edd737d16850804.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/48243caac75871a55df87393efa1346ff8faf3af.b7f2f54861e9cc4612a3.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/4a5e7700a9829e50633bcd01415fa520d6ea06b8.fc0ead9098bbbdf4666d.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/75fc9c18.3b708927af96336d0b13.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/93fe9d73.20288d194fcf90c3dc30.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/9b77ebf0fdaf6465b4031635f6dd52d1a5ce48f0.278e86512316d8fc1ce0.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/c4510d1e.294bc09365d9292fb756.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/c8f7fe3b0e41be846d5687592cf2018ff6e22687.c6793ef8975f35b655d6.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/f6078781a05fe1bcb0902d23dbbb2662c8d200b3.134032c0c720e341f592.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/framework.df8ae3020d53a89c6279.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/main-179b62a998f82d0275fa.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/pages/_app-19b2fe7267c9801eb6e0.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/pages/_error-bd92bd06554e6db9ab3c.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/pages/charts-1f6dc2fe7a12cc8b8620.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/pages/index-5121fd08ecf36d15e5cd.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/pages/schedule-03e4665d7d410660d03a.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/polyfills-016998d612b101b8b0fc.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/chunks/webpack-3344615322e66192569a.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/css/704dde143b0d250170ef.css",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/o02Rx02oc21SsQv6WbgUu/_buildManifest.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/_next/static/o02Rx02oc21SsQv6WbgUu/_ssgManifest.js",revision:"o02Rx02oc21SsQv6WbgUu"},{url:"/favicon.ico",revision:"80f648e6edc98f78e4df22c487b90d95"},{url:"/icons/icon-128x128.png",revision:"ce3d1e79edb72e58e7a6538aa36ca8ec"},{url:"/icons/icon-144x144.png",revision:"446bd1cacc9dec34977f678df79822e2"},{url:"/icons/icon-152x152.png",revision:"3ecb7296823690c5304c07fd62cd10cf"},{url:"/icons/icon-16x16.png",revision:"dcaefdaf8f15ea47b75b52cefb3aefad"},{url:"/icons/icon-192x192.png",revision:"0e47603c3088854b0294cf7bb37e9ea2"},{url:"/icons/icon-32x32.png",revision:"54d2d3642c92480f8128c09e342e7563"},{url:"/icons/icon-384x384.png",revision:"d424ddcb4b11d5c96fc255fdaa5d27db"},{url:"/icons/icon-512x512.png",revision:"44ff06f61451039de6f5027edb2afb44"},{url:"/icons/icon-72x72.png",revision:"36aa0a1319ece3187555d95361345a94"},{url:"/icons/icon-96x96.png",revision:"9f62ce8ff0cd239291d20a4b5ccd071a"},{url:"/manifest.json",revision:"f71fa30c7bb706c2e8d5ff16228fb19c"},{url:"/robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[new e.ExpirationPlugin({maxEntries:1,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/api\/.*$/i,new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/.*/i,new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET")}));
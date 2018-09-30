'use strict';
var VERSION = '1.0.0';
var CACHE_NAME = 'sw-rss-' + VERSION;
var cacheWhitelist = [CACHE_NAME];


function cacheData(req, data) {
    return caches.open(CACHE_NAME).then(function (cache) {
        cache.put(req.clone(), data);
    });
}

function entryFilter(event) {
    const request = event.request;
    const url = request.url;
    if (request.method !== 'GET') {
        return false;
    }
    return /\.(html|css|js)\b/.test(url.split('?')[0]) || isMeituanImgUrl(url) || /:\/\/.*\/$/.test(url);
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll([]);
            }).catch(console.warning)
    );
});
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
self.addEventListener('fetch', function (event) {
    if (entryFilter(event)) {
        event.respondWith(
            caches.match(event.request)
                .then(function (cacheResponse) {
                        if (cacheResponse) {
                            const contentType = cacheResponse.headers.get('Content-Type') || '';
                            if (isFiles(contentType)(['html'])) {
                                fetch(event.request).then(function (res) {
                                    cacheData(event.request, res.clone());
                                });
                            }
                            return cacheResponse;
                        }
                        let fetchRequest = event.request;
                        if (isImgUrl(fetchRequest.url) || isMeiTuanUrl(fetchRequest.url)) {
                            fetchRequest = new Request(event.request.url.replace('http:', ''), { mode: 'cors' });
                        }
                        return fetch(fetchRequest.clone()).then(
                            function (response) {
                                if (!response || response.status !== 200) {
                                    return response;
                                }
                                cacheData(event.request, response.clone());
                                return response;
                            }
                        ).catch(e => e);
                    }
                )
        );
    }
});
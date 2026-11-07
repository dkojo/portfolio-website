// CloudFront Function (cloudfront-js-2.0), runs on every request before the cache.
// 1. www.<domain> → 301 to the bare domain, keeping path and query string.
// 2. Clean URLs → the pre-rendered files in S3: /about → /about/index.html, /projects/ → /projects/index.html.
// Rendered by Terraform's templatefile(), which fills in the domain.
function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value : '';

  if (host === 'www.${domain}') {
    var query = Object.keys(request.querystring)
      .map(function (key) {
        var param = request.querystring[key];
        var values = param.multiValue ? param.multiValue : [param];
        return values.map(function (v) { return v.value === '' ? key : key + '=' + v.value; }).join('&');
      })
      .join('&');
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://${domain}' + request.uri + (query ? '?' + query : '') } },
    };
  }

  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (uri.substring(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    request.uri = uri + '/index.html';
  }
  return request;
}

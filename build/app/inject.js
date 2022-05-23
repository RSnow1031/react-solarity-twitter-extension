



function fetch(data, sender, sendResponse) {
  return new Promise(function(resolve, reject) {
    var request = new Request(data.input, data.init);
    if (request.signal && request.signal.aborted) {
      return reject()
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;

      sendResponse({body:body,options:options});
          /*var event = new CustomEvent('RecieveTransaction', {detail:  "ts-complete",data:new Response(body, options)});
          window.dispatchEvent(event);*/
          
        };

        xhr.onerror = function() {
          reject(new TypeError('Network request failed'));
        };

        xhr.ontimeout = function() {
          reject(new TypeError('Network request failed'));
        };

        xhr.onabort = function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        };

        xhr.open(request.method, request.url, true);

        if (request.credentials === 'include') {
          xhr.withCredentials = true;
        } else if (request.credentials === 'omit') {
          xhr.withCredentials = false;
        }

        /*if ('responseType' in xhr && support.blob) {
          xhr.responseType = 'blob';
        }*/

        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });

        if (request.signal) {
          request.signal.addEventListener('abort', abortXhr);

          xhr.onreadystatechange = function() {
            // DONE (success or failure)
            if (xhr.readyState === 4) {
              request.signal.removeEventListener('abort', abortXhr);
            }
          };
        }

        xhr.send(data.init.body);
      })
}


function parseHeaders(rawHeaders) {
  var headers = new Headers();
      // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
      // https://tools.ietf.org/html/rfc7230#section-3.2
      var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
      preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          headers.append(key, value);
        }
      });
      return headers
    }
    


    function onExtMessage(message, sender, sendResponse){
     switch (message.command) {
      case "getTransaction":
      fetch(message.data, sender, sendResponse)
      break;

    }
    return true
  }


  chrome.runtime.onMessage.addListener(onExtMessage);

 
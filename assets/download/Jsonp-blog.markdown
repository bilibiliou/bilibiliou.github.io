Remote JSON - JSONP

The browser security model dictates that XMLHttpRequest, frames, etc. must have the same domain in order to communicate. That's not a terrible idea, for security reasons, but it sure does make distributed (service oriented, mash-up, whatever it's called this week) web development suck.

There are traditionally three solutions to solving this problem.

Local proxy:
Needs infrastructure (can't run a serverless client) and you get double-taxed on bandwidth and latency (remote - proxy - client).
Flash:
Remote host needs to deploy a crossdomain.xml file, Flash is relatively proprietary and opaque to use, requires learning a one-off moving target programming langage.
Script tag:
Difficult to know when the content is available, no standard methodology, can be considered a "security risk".
I'm proposing a new technology agnostic standard methodology for the script tag method for cross-domain data fetching: JSON with Padding, or simply JSONP.

The way JSONP works is simple, but requires a little bit of server-side cooperation. Basically, the idea is that you let the client decide on a small chunk of arbitrary text to prepend to the JSON document, and you wrap it in parentheses to create a valid JavaScript document (and possibly a valid function call).

The client decides on the arbitrary prepended text by using a query argument named jsonp with the text to prepend. Simple! With an empty jsonp argument, the result document is simply JSON wrapped in parentheses.

Let's take the del.icio.us JSON API as an example. This API has a "script tag" variant that looks like this:

http://del.icio.us/feeds/json/bob/mochikit+interpreter:

if(typeof(Delicious) == 'undefined') Delicious = {};
Delicious.posts = [{
    "u": "http://mochikit.com/examples/interpreter/index.html",
    "d": "Interpreter - JavaScript Interactive Interpreter",
    "t": [
        "mochikit","webdev","tool","tools",
        "javascript","interactive","interpreter","repl"
    ]
}]
In terms of JSONP, a document semantically identical to this would be available at the following URL:

http://del.icio.us/feeds/json/bob/mochikit+interpreter?jsonp=if(typeof(Delicious)%3D%3D%27undefined%27)Delicious%3D%7B%7D%3BDelicious.posts%3D

That's not very interesting on its own, but let's say I wanted to be notified when the document is available. I could come up with a little system for tracking them:

var delicious_callbacks = {};
function getDelicious(callback, url) {
    var uid = (new Date()).getTime();
    delicious_callbacks[uid] = function () {
        delete delicious_callbacks[uid];
        callback();
    };
    url += "?jsonp=" + encodeURIComponent("delicious_callbacks[" + uid + "]");
    // add the script tag to the document, cross fingers
};

getDelicious(doSomething, "http://del.icio.us/feeds/json/bob/mochikit+interpreter");
The fetched URL from this hypothetical experiment would look something like this:

http://del.icio.us/feeds/json/bob/mochikit+interpreter?jsonp=delicious_callbacks%5B12345%5D

delicious_callbacks[12345]([{
    "u": "http://mochikit.com/examples/interpreter/index.html",
    "d": "Interpreter - JavaScript Interactive Interpreter",
    "t": [
        "mochikit","webdev","tool","tools",
        "javascript","interactive","interpreter","repl"
    ]
}])
See, because we're wrapping with parentheses, a JSONP request can translate into a function call or a plain old JSON literal. All the server needs to do differently is prepend a little bit of text to the beginning and wrap the JSON in parentheses!

Now, of course, you'd have libraries like MochiKit, Dojo, etc. abstracting JSONP so that you don't have to write the ugly DOM script tag insertion yourself, etc.

Of course, this just solves the standardization problem. Your page is still toast if the remote host decides to inject malicious code instead of JSON data. However, if implemented, it'd save a lot of developers some time and allow for generic abstractions, tutorials, and documentation to be built.

05 December 2005
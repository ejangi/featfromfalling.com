(function(window, document){
    function trackClick(e) {
        var t = e.target,
            s,
            label = '';
        
        if (t.tagName.toLowerCase() != 'img') {
            t = t.parentElement;
        }

        if (t.tagName.toLowerCase() != 'img') {
            t = t.querySelector('a');
        }

        s = t.parentNode;

        while(s.className != 'song') {
            s = s.parentNode;
        }

        label = t.parentElement.className + ': ' + s.getAttribute('data-name');

        gtag('event', 'view_item', {
            'event_category': 'engagement',
            'event_label': label
        });
    }

    window.addEventListener('DOMContentLoaded', function(e) {
        var as = document.querySelectorAll('a[href^="https://open.spotify.com"]');

        for(var i = 0; i < as.length; i++) {
            as[i].addEventListener("click", trackClick, false);
        }
    });
})(window, document);
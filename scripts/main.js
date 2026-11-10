(function(window, document){
    function trackClick(e) {
        var link = e.currentTarget,
            store = link.parentElement,
            song = link.closest('.song'),
            label = store.className + ': ' + song.getAttribute('data-name');

        gtag('event', 'view_item', {
            'event_category': 'engagement',
            'event_label': label
        });
    }

    window.addEventListener('DOMContentLoaded', function(e) {
        var as = document.querySelectorAll('.song .stores a');

        for(var i = 0; i < as.length; i++) {
            as[i].addEventListener("click", trackClick, false);
        }
    });
})(window, document);

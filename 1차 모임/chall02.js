Java.perform(() => {
    setTimeout(function() {
        Java.choose("uk.rossmarks.fridalab.MainActivity", {
            "onMatch": function(instance) {
                instance.chall02();
            },
            "onComplete": function() {}
        });
    }, 1000);
});